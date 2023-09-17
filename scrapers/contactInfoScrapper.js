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
        /\d{2}\.\d\.\d{4}\.\d{4}/     // xx.x.xxxx.xxxx
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

module.exports = {
    extractContactInfoFromDescription
};
