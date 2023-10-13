function extractContactInfoFromDescription(description) {
    const phonePatterns = [
        /\+\d{2}\(\d{2}\)\d{5}-\d{4}/, // +xx(xx)xxxxx-xxxx
        /\+\d{2} \d{2} \d{9}/,        // +xx xx xxxxxxxxx
        /\+\d{2} \d{2} \d{4}-\d{4}/,  // +xx xx xxxx-xxxx
        /\(\+\d{2}\) \d{2} \d{9}/,    // (+xx) xx xxxxxxxxx
        /\(\d{2}\)\d{9}/,             // (xx)xxxxxxxxx
        /\(\d{2}\) \d{5}-\d{4}/,      // (xx) xxxxx-xxxx
        /\d{2} \d{5}-\d{4}/,          // xx xxxxx-xxxx
        /\d{2} \d{8}/,                // xx xxxxxxxxx
        /\d{2}-\d{9}/,                // xx-xxxxxxxxx
        /\d{2} \d \d{4} \d{4}/,       // xx x xxxx xxxx
        /\d{10}/,                     // xxxxxxxxxxx
        /\d{2}\.\d\.\d{4}\.\d{4}/,    // xx.x.xxxx.xxxx
        /\(\d{2}\) \d{9}/,            // (xx) xxxxxxxxx
        /\d{2} \d{3} \d{3} \d{3}/     // xx xxx xxx xxx
    ];

    const uniqueContactInfo = new Set(); // Use a Set to store unique phone numbers

    phonePatterns.forEach(pattern => {
        const matches = description.match(pattern);
        if (matches) {
            // Since we only want to save unique matches, add the first match found
            uniqueContactInfo.add(matches[0]);
        }
    });

    // Convert the Set back to an array before returning
    return Array.from(uniqueContactInfo);
}

function extractIdfromAdLink(adLink) {
    // Split the adLink by "/" to extract individual parts
    const parts = adLink.split("/");

    // Loop through the parts to find a part that resembles an ID
    for (const part of parts) {
        // Check if the part is a numeric ID (assuming IDs are numeric)
        if (/^\d+$/.test(part)) {
            return part; // Return the first numeric part found as the ID
        }
    }

    // If no ID is found, return null or an appropriate value
    return null;
}

function extractPhoneFromWhatsAppLink(link) {
    // Define a regular expression to extract the phone number from a WhatsApp API link
    const regex = /(?:\?|&)phone=(\d+)/;

    // Use the regular expression to find a match in the link
    const match = link.match(regex);

    // If a match is found, return the extracted phone number, otherwise return null
    if (match && match[1]) {
        return match[1];
    } else {
        return null;
    }
}

module.exports = {
    extractContactInfoFromDescription,
    extractIdfromAdLink,
    extractPhoneFromWhatsAppLink
};
