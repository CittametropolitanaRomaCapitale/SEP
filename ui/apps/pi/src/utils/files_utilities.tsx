/**
 * Crea e scarica un file a partire da una stringa base64.
 *
 * @param {string} base64String - La stringa codificata in base64 che rappresenta il contenuto del file.
 * @param {string} fileName - Il nome del file da scaricare, inclusa l'estensione.
 * @param {string} mimeType - Il tipo MIME del file da scaricare (ad esempio, 'application/pdf' per un file PDF).
 */
export const buildAndDownloadFile = (base64String: string, fileName: string, mimeType: string) => {
    const dataUri = `data:${mimeType};base64,${base64String}`;
    const downloadLink = document.createElement('a');
    downloadLink.href = dataUri;
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
};

/**
 * Converte un Uint8Array in una stringa Base64.
 *
 * @param {Uint8Array} uint8Array - L'array di byte da convertire.
 * @returns {string} - La stringa Base64 risultante.
 */
export const uint8ArrayToBase64 = (uint8Array) => Buffer.from(uint8Array).toString('base64');

/**
 * Permette di ricavare il nome del file dal contentType.
 *
 * @param {contentType} contentType - Il contentType del file
 * @returns {string} - il filename
 */
export const getFilenameByContentType = (contentType) => {
    const regexMultiPart = /name\*\d+=([^;]+)/g;
    const regexSinglePart = /name=([^;]+)/;
    let match;
    let filename = '';

    // Controlla se ci sono parti multiple
    if ((match = regexMultiPart.exec(contentType)) !== null) {
        do {
            filename += match[1];
        } while ((match = regexMultiPart.exec(contentType)) !== null);
    } else if ((match = regexSinglePart.exec(contentType)) !== null) {
        // Se non ci sono parti multiple, controlla per una singola parte
        filename = match[1];
    }

    return filename;

}

export const getFileExtension = (fileName: string): string => fileName.split('.').pop() || '';


export const getBase64 = async (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
        const {result} = reader;
        resolve(result?.toString().split(',')[1]);
    };

    reader.onerror = (error) => {
        reject(error);
    };
})
