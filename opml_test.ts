// opml_test.ts

import { assertEquals } from "@std/assert";
import { getOutlineHtml, parse, stringify } from "./opml.ts";

const opmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<opml version="2.0">
    <head>
        <title>States</title>
        <dateCreated>Tue, 15 Mar 2005 16:35:45 GMT</dateCreated>
        <flPublic>true</flPublic>
        <urlPublic>http://drummer.scripting.com/davewiner/states.opml</urlPublic>
        <urlJson>http://drummer.scripting.com/davewiner/states.json</urlJson>
        <ownerTwitterScreenName>davewiner</ownerTwitterScreenName>
        <ownerName>Dave Winer</ownerName>
        <ownerId>http://twitter.com/davewiner</ownerId>
        <urlUpdateSocket>ws://drummer.scripting.com:1232/</urlUpdateSocket>
        <dateModified>Sat, 03 Jul 2021 15:19:39 GMT</dateModified>
        <expansionState>1,4</expansionState>
        <lastCursor>5</lastCursor>
    </head>
    <body>
        <outline text="United States" created="Tue, 15 Mar 2005 16:35:45 GMT">
            <outline text="Far West" created="Tue, 15 Mar 2005 16:35:45 GMT">
                <outline text="Alaska" created="Tue, 15 Mar 2005 16:35:45 GMT"/>
                <outline text="California" created="Tue, 15 Mar 2005 16:35:45 GMT"/>
                <outline text="Hawaii" created="Tue, 15 Mar 2005 16:35:45 GMT"/>
                <outline text="Nevada" created="Tue, 15 Mar 2005 16:35:45 GMT"/>
                <outline text="Oregon" created="Tue, 15 Mar 2005 16:35:45 GMT"/>
                <outline text="Washington" created="Tue, 15 Mar 2005 16:35:45 GMT"/>
            </outline>
            <outline text="Great Plains" created="Tue, 15 Mar 2005 16:35:45 GMT">
                <outline text="Kansas" created="Tue, 15 Mar 2005 16:35:45 GMT"/>
                <outline text="Nebraska" created="Tue, 15 Mar 2005 16:35:45 GMT"/>
                <outline text="North Dakota" created="Tue, 15 Mar 2005 16:35:45 GMT"/>
                <outline text="Oklahoma" created="Tue, 15 Mar 2005 16:35:45 GMT"/>
                <outline text="South Dakota" created="Tue, 15 Mar 2005 16:35:45 GMT"/>
            </outline>
            <outline text="Mid-Atlantic" created="Tue, 15 Mar 2005 16:35:45 GMT">
                <outline text="Delaware" created="Tue, 15 Mar 2005 16:35:45 GMT"/>
                <outline text="Maryland" created="Tue, 15 Mar 2005 16:35:45 GMT"/>
                <outline text="New Jersey" created="Tue, 15 Mar 2005 16:35:45 GMT"/>
                <outline text="New York" created="Tue, 15 Mar 2005 16:35:45 GMT"/>
                <outline text="Pennsylvania" created="Tue, 15 Mar 2005 16:35:45 GMT"/>
            </outline>
            <outline text="Midwest" created="Tue, 15 Mar 2005 16:35:45 GMT">
                <outline text="Illinois" created="Tue, 15 Mar 2005 16:35:45 GMT"/>
                <outline text="Indiana" created="Tue, 15 Mar 2005 16:35:45 GMT"/>
                <outline text="Iowa" created="Tue, 15 Mar 2005 16:35:45 GMT"/>
                <outline text="Kentucky" created="Tue, 15 Mar 2005 16:35:45 GMT"/>
                <outline text="Michigan" created="Tue, 15 Mar 2005 16:35:45 GMT"/>
                <outline text="Minnesota" created="Tue, 15 Mar 2005 16:35:45 GMT"/>
                <outline text="Missouri" created="Tue, 15 Mar 2005 16:35:45 GMT"/>
                <outline text="Ohio" created="Tue, 15 Mar 2005 16:35:45 GMT"/>
                <outline text="West Virginia" created="Tue, 15 Mar 2005 16:35:45 GMT"/>
                <outline text="Wisconsin" created="Tue, 15 Mar 2005 16:35:45 GMT"/>
            </outline>
            <outline text="Mountains" created="Tue, 15 Mar 2005 16:35:45 GMT">
                <outline text="Colorado" created="Tue, 15 Mar 2005 16:35:45 GMT"/>
                <outline text="Idaho" created="Tue, 15 Mar 2005 16:35:45 GMT"/>
                <outline text="Montana" created="Tue, 15 Mar 2005 16:35:45 GMT"/>
                <outline text="Utah" created="Tue, 15 Mar 2005 16:35:45 GMT"/>
                <outline text="Wyoming" created="Tue, 15 Mar 2005 16:35:45 GMT"/>
            </outline>
            <outline text="New England" created="Tue, 15 Mar 2005 16:35:45 GMT">
                <outline text="Connecticut" created="Tue, 15 Mar 2005 16:35:45 GMT"/>
                <outline text="Maine" created="Tue, 15 Mar 2005 16:35:45 GMT"/>
                <outline text="Massachusetts" created="Tue, 15 Mar 2005 16:35:45 GMT"/>
                <outline text="New Hampshire" created="Tue, 15 Mar 2005 16:35:45 GMT"/>
                <outline text="Rhode Island" created="Tue, 15 Mar 2005 16:35:45 GMT"/>
                <outline text="Vermont" created="Tue, 15 Mar 2005 16:35:45 GMT"/>
            </outline>
            <outline text="South" created="Tue, 15 Mar 2005 16:35:45 GMT">
                <outline text="Alabama" created="Tue, 15 Mar 2005 16:35:45 GMT"/>
                <outline text="Arkansas" created="Tue, 15 Mar 2005 16:35:45 GMT"/>
                <outline text="Florida" created="Tue, 15 Mar 2005 16:35:45 GMT"/>
                <outline text="Georgia" created="Tue, 15 Mar 2005 16:35:45 GMT"/>
                <outline text="Louisiana" created="Tue, 15 Mar 2005 16:35:45 GMT"/>
                <outline text="Mississippi" created="Tue, 15 Mar 2005 16:35:45 GMT"/>
                <outline text="North Carolina" created="Tue, 15 Mar 2005 16:35:45 GMT"/>
                <outline text="South Carolina" created="Tue, 15 Mar 2005 16:35:45 GMT"/>
                <outline text="Tennessee" created="Tue, 15 Mar 2005 16:35:45 GMT"/>
                <outline text="Virginia" created="Tue, 15 Mar 2005 16:35:45 GMT"/>
            </outline>
            <outline text="Southwest" created="Tue, 15 Mar 2005 16:35:45 GMT">
                <outline text="Arizona" created="Tue, 15 Mar 2005 16:35:45 GMT"/>
                <outline text="New Mexico" created="Tue, 15 Mar 2005 16:35:45 GMT"/>
                <outline text="Texas" created="Tue, 15 Mar 2005 16:35:45 GMT"/>
            </outline>
        </outline>
    </body>
</opml>`;

/**
 * Finds the position where two strings diverge.
 * @param str1 - The first string to compare.
 * @param str2 - The second string to compare.
 * @returns An object containing the position of divergence and the differing characters.
 */
function findDivergence(str1: string, str2: string): { position: number, char1: string, char2: string } | null {
    const maxLength = Math.max(str1.length, str2.length);

    for (let i = 0; i < maxLength; i++) {
        const char1 = str1[i] || '';
        const char2 = str2[i] || '';

        if (char1 !== char2) {
            return { position: i, char1, char2 };
        }
    }

    // If no divergence is found, return null
    return null;
}

Deno.test("OPML Parsing and Stringifying", async () => {
    const parsedOpml = await parse(opmlContent);

    // Check if the OPML object has the correct structure
    assertEquals(parsedOpml.opml.head?.title, "States");
    assertEquals(parsedOpml.opml.head?.dateCreated, "Tue, 15 Mar 2005 16:35:45 GMT");
    assertEquals(parsedOpml.opml.head?.flPublic, "true");
    assertEquals(parsedOpml.opml.head?.urlPublic, "http://drummer.scripting.com/davewiner/states.opml");
    assertEquals(parsedOpml.opml.head?.urlJson, "http://drummer.scripting.com/davewiner/states.json");
    assertEquals(parsedOpml.opml.head?.ownerTwitterScreenName, "davewiner");
    assertEquals(parsedOpml.opml.head?.ownerName, "Dave Winer");
    assertEquals(parsedOpml.opml.head?.ownerId, "http://twitter.com/davewiner");
    assertEquals(parsedOpml.opml.head?.urlUpdateSocket, "ws://drummer.scripting.com:1232/");
    assertEquals(parsedOpml.opml.head?.dateModified, "Sat, 03 Jul 2021 15:19:39 GMT");
    assertEquals(parsedOpml.opml.head?.expansionState, "1,4");
    assertEquals(parsedOpml.opml.head?.lastCursor, "5");

    // Check if the body contains the expected outlines
    const body = parsedOpml.opml.body;
    assertEquals(body?.subs?.length, 1);
    assertEquals(body?.subs?.[0].text, "United States");
    assertEquals(body?.subs?.[0].subs?.length, 8); // Updated to 8

    // Check if stringifying the OPML object returns the original OPML content
    const stringifiedOpml = stringify(parsedOpml);
    const normalizedOriginal = opmlContent.replace(/\s+/g, '').trim();
    const normalizedStringified = stringifiedOpml.replace(/\s+/g, '').trim();
    const divergence = findDivergence(normalizedStringified, normalizedOriginal);
    assertEquals(divergence, null);
});

Deno.test("OPML to HTML Conversion", async () => {
    const parsedOpml = await parse(opmlContent);
    const htmlOutput = getOutlineHtml(parsedOpml);

    // Check if the HTML output contains the expected structure
    assertEquals(htmlOutput.includes("<ul>"), true);
    assertEquals(htmlOutput.includes("<li>United States</li>"), true);
    assertEquals(htmlOutput.includes("<li>Far West</li>"), true);
    assertEquals(htmlOutput.includes("<li>Alaska</li>"), true);
});
