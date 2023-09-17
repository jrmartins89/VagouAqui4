function extractContactInfoFromDescription(description) {
    const phonePatterns = [
        /\(\d{2}\) \d{9}/,                 // (xx) xxxxxxxxx
        /\d{2}-\d{9}/,                    // xx-xxxxxxxxx
        /\+\d{2} \d{2} \d{9}/,            // +xx xx xxxxxxxxx
        /\d{2} \d{5}-\d{4}/,              // xx xxxxx-xxxx
        /\+\d{2} \d{2} \d{5}-\d{4}/,      // +xx xx xxxxx-xxxx
        /\d{2} \d{8}/,                    // xx xxxxxxxxx
        /\(\+\d{2}\) \d{2} \d{9}/         // (+xx) xx xxxxxxxxx
    ];

    const contactInfo = [];

    phonePatterns.forEach(pattern => {
        const matches = description.match(pattern);
        if (matches) {
            contactInfo.push(matches[0]);
        }
    });

    return contactInfo;
}

module.exports = {
    extractContactInfoFromDescription
};
