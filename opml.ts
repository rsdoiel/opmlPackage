// opml.ts

// Credit: This code is based on Dave Winer's opmlPackage.js
// GitHub Repository: https://github.com/scripting/opmlPackage

const myVersion = "0.5.7";
const myProductName = "opmlPackage";
const generatorForHead = `opml v${myVersion} (npmjs.com/package/opml)`;

import * as utils from "npm:daveutils";
import * as opmltojs from "./opmltojs.ts";
import * as xml2js from "npm:xml2js";

// Define the structure of an outline node and the OPML object
interface OutlineNode {
  text?: string;
  type?: string;
  url?: string;
  subs?: OutlineNode[];
  [key: string]: any;
}

interface OPML {
  opml: {
    head?: { [key: string]: any };
    body?: { subs?: OutlineNode[] };
    [key: string]: any;
};
}

/**
 * Type guard to check if an object is an OutlineNode.
 * @param obj - The object to check.
 * @returns True if the object is an OutlineNode, false otherwise.
 */
function isOutlineNode(obj: any): obj is OutlineNode {
  return obj && typeof obj === "object" && "subs" in obj;
}

/**
 * Parses an OPML text string and returns a JavaScript object representing the OPML structure.
 * @param opmltext - The OPML text string to parse.
 * @returns A promise that resolves to the parsed OPML object.
 */
export async function parse(opmltext: string): Promise<OPML> {
  function isScalar(obj: any): boolean {
    return typeof obj !== "object";
  }

  function addGenerator(theOpml: any): void {
    try {
      theOpml.head.generator = generatorForHead;
    } catch (err) {
      // Ignore error
    }
  }

  function convert(sourcestruct: any, deststruct: any): void {
    if (sourcestruct !== undefined) {
      const atts = sourcestruct["$"];
      if (atts !== undefined) {
        for (const x in atts) {
          if (x !== "subs") {
            deststruct[x] = atts[x];
          }
        }
        delete sourcestruct["$"];
      }
      for (const x in sourcestruct) {
        const obj = sourcestruct[x];
        if (isScalar(obj)) {
          deststruct[x] = obj;
        } else {
          if (x === "outline") {
            if (deststruct.subs === undefined) {
              deststruct.subs = [];
            }
            if (Array.isArray(obj)) {
              for (const item of obj) {
                const newobj = {};
                convert(item, newobj);
                deststruct.subs.push(newobj);
              }
            } else {
              const newobj = {};
              convert(obj, newobj);
              deststruct.subs.push(newobj);
            }
          } else {
            deststruct[x] = {};
            convert(obj, deststruct[x]);
          }
        }
      }
    }
  }

  return new Promise((resolve, reject) => {
    xml2js.parseString(
      opmltext,
      { explicitArray: false },
      (err: Error | null, jstruct: any) => {
        if (err) {
          reject(err);
        } else {
          if (jstruct == null) {
            reject(
              new Error("Internal error: xml2js.parseString returned null."),
            );
          } else {
            const theOutline: OPML = { opml: {} };
            convert(jstruct.opml, theOutline.opml);
            addGenerator(theOutline.opml);
            if (isScalar(theOutline.opml.head)) {
              theOutline.opml.head = {};
            }
            if (isScalar(theOutline.opml.body)) {
              theOutline.opml.body = {};
            }
            resolve(theOutline);
          }
        }
      },
    );
  });
}

/**
 * Converts an OPML object back into an OPML text string with the correct structure.
 * @param theOutline - The OPML object to convert.
 * @returns The OPML text string.
 */
export function stringify (theOutline: OPML): string { //returns the opmltext for the outline
	var opmltext = opmltojs.opmlify(theOutline);
	return (opmltext);
}

/**
 * Generates an HTML representation of an OPML outline.
 * @param theOutline - The OPML object to convert to HTML.
 * @returns The HTML string representation of the OPML outline.
 */
export function getOutlineHtml(theOutline: OPML): string {
  let htmltext = "";
  let indentlevel = 0;

  function add(s: string): void {
    htmltext += "\t".repeat(indentlevel) + s + "\n";
  }

  function addSubsHtml(node: OutlineNode): void {
    add("<ul>");
    indentlevel++;
    node.subs?.forEach((sub) => {
      add(`<li>${sub.text}</li>`);
      if (sub.subs !== undefined) {
        addSubsHtml(sub);
      }
    });
    add("</ul>");
    indentlevel--;
  }

  addSubsHtml(theOutline.opml.body as OutlineNode);
  return htmltext;
}

/**
 * Expands an include node in the OPML outline.
 * @param theNode - The outline node to expand.
 * @returns A promise that resolves to the expanded outline node or body.
 */
export async function expandInclude(
  theNode: OutlineNode,
): Promise<OutlineNode | OPML> {
  if (theNode.type === "include" && theNode.url !== undefined) {
    const opmltext = await fetchOpml(theNode.url);
    const theOutline = await parse(opmltext);
    return theOutline.opml.body as OutlineNode;
  } else {
    return theNode;
  }
}

/**
 * Expands all include nodes in the OPML outline.
 * @param theOutline - The OPML object to expand includes in.
 * @returns A promise that resolves to the expanded OPML object.
 */
export async function expandIncludes(theOutline: OPML): Promise<OPML> {
  async function expandBody(theBody: OutlineNode): Promise<OutlineNode> {
    const theNewBody: OutlineNode = {};
    let lastNewNode: OutlineNode = theNewBody;
    const stack: OutlineNode[] = [];
    let currentOutline: OutlineNode = lastNewNode;

    function getNameAtt(theNode: OutlineNode): string {
      return theNode.name ?? utils.innerCaseName(theNode.text as string);
    }

    function inlevelcallback(): void {
      stack.push(currentOutline);
      currentOutline = lastNewNode;
      if (currentOutline.subs === undefined) {
        currentOutline.subs = [];
      }
    }

    function nodecallback(theNode: OutlineNode): void {
      const newNode: OutlineNode = {};
      utils.copyScalars(theNode, newNode);
      currentOutline.subs?.push(newNode);
      lastNewNode = newNode;
    }

    function outlevelcallback(): void {
      currentOutline = stack.pop() as OutlineNode;
    }

    async function bodyVisiter(theOutline: OutlineNode): Promise<void> {
      async function readInclude(
        theIncludeNode: OutlineNode,
      ): Promise<OutlineNode | undefined> {
        const expandedBody = await expandInclude(theIncludeNode);
        if (isOutlineNode(expandedBody)) {
          return await expandBody(expandedBody);
        }
        return undefined;
      }

      async function doLevel(head: OutlineNode): Promise<void> {
        for (let ixsub = 0; ixsub < (head.subs?.length ?? 0); ixsub++) {
          const sub = head.subs![ixsub];
          if (!utils.getBoolean(sub.iscomment)) {
            if (sub.type === "include") {
              nodecallback(sub);
              const theIncludedOutline = await readInclude(sub);
              if (theIncludedOutline !== undefined) {
                await doLevel(theIncludedOutline);
              }
            } else {
              nodecallback(sub);
              if (sub.subs !== undefined) {
                await doLevel(sub);
              }
            }
          }
        }
        outlevelcallback();
      }

      inlevelcallback();
      if (theOutline.type === "include") {
        const theIncludedOutline = await readInclude(theOutline);
        if (theIncludedOutline !== undefined) {
          await doLevel(theIncludedOutline);
        }
      } else {
        await doLevel(theOutline);
      }
    }

    await bodyVisiter(theBody);
    return theNewBody;
  }

  const theNewBody = await expandBody(theOutline.opml.body as OutlineNode);
  const theNewOutline: OPML = {
    opml: {
      head: {},
      body: theNewBody,
    },
  };
  utils.copyScalars(theOutline.opml.head, theNewOutline.opml.head);
  return theNewOutline;
}

/**
 * Reads an OPML file from a URL and parses it into an OPML object.
 * @param urlOpmlFile - The URL of the OPML file to read.
 * @returns A promise that resolves to the parsed OPML object.
 */
export async function readOutline(urlOpmlFile: string): Promise<OPML> {
  const opmltext = await fetchOpml(urlOpmlFile);
  return await parse(opmltext);
}

/**
 * Fetches the content of a URL using the fetch API.
 * @param url - The URL to fetch.
 * @returns A promise that resolves to the response text.
 */
async function fetchOpml(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }
  return await response.text();
}
