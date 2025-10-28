// Encryption utilities
export function encryptData(data, key) {
    const encrypted = {};
    for (let field in data) {
        if (typeof data[field] === 'string') {
            // Convert string to base64 first
            const textEncoder = new TextEncoder();
            const encoded = textEncoder.encode(data[field]);
            const encryptedArray = new Uint8Array(encoded.length);
            
            // XOR encryption with key cycling
            for (let i = 0; i < encoded.length; i++) {
                encryptedArray[i] = encoded[i] ^ key.charCodeAt(i % key.length);
            }
            
            // Convert to base64 string
            encrypted[field] = btoa(String.fromCharCode.apply(null, encryptedArray));
        } else if (typeof data[field] === 'number') {
            // For numbers, store as encrypted string
            const numStr = data[field].toString();
            const encryptedNum = numStr.split('').map((char, i) => 
                String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length))
            ).join('');
            encrypted[field] = btoa(encryptedNum);
        } else {
            // For other types, store as is
            encrypted[field] = data[field];
        }
    }
    return encrypted;
}

export function decryptData(encryptedData, key) {
    const decrypted = {};
    for (let field in encryptedData) {
        try {
            // Decode base64 string
            const encrypted = atob(encryptedData[field]);
            const decryptedArray = new Uint8Array(encrypted.length);
            
            // XOR decryption with key cycling
            for (let i = 0; i < encrypted.length; i++) {
                decryptedArray[i] = encrypted.charCodeAt(i) ^ key.charCodeAt(i % key.length);
            }
            
            // Convert back to string
            const textDecoder = new TextDecoder();
            let decryptedValue = textDecoder.decode(decryptedArray);
            
            // Try to convert to number if it was a number
            if (!isNaN(decryptedValue)) {
                decryptedValue = parseFloat(decryptedValue);
            }
            
            decrypted[field] = decryptedValue;
        } catch (e) {
            // If decryption fails (e.g., not base64), keep original value
            decrypted[field] = encryptedData[field];
        }
    }
    return decrypted;
}

export function calculateDistance(lat1, lon1, lat2, lon2) {
    // Haversine formula to calculate distance between two points
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in km
}