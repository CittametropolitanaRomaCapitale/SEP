import { readEml } from 'eml-parse-js';
import { formatDate } from '@cmrc/ui/utils/formatters';
import { useEffect, useState } from 'react';
import toast from '@cmrc/ui/components/Toast';
import { dictionary } from '../dictionary';
import { getFilenameByContentType, uint8ArrayToBase64 } from '../../../../utils/files_utilities';

export const useEmlBuilder = (email) => {
    const [emailData, setEmailData] = useState(null)

    useEffect(() => {
        if (email)
            parseEmail(email);
    }, [email]);

    const parseEmail = (fileData) => {
        const emailBuilder = {
            from: null,
            to: null,
            subject: null,
            body: null,
            cc: null,
            date: null,
            attachments: []
        };

        readEml(fileData, (err, ReadEmlJson) => {
            try {
                if (ReadEmlJson) {
                    emailBuilder.from = ReadEmlJson?.headers?.From;
                    emailBuilder.to = ReadEmlJson?.headers?.To;
                    emailBuilder.subject = ReadEmlJson?.subject || ReadEmlJson?.headers?.Subject;
                    emailBuilder.cc = ReadEmlJson?.headers?.CC || ReadEmlJson?.headers?.Cc;
                    emailBuilder.date = formatDate({ date: new Date(ReadEmlJson?.headers?.Date || ReadEmlJson?.date) });

                    // Definisce il corpo della email, se non è presente nell'elemento html lo estrapola dagli attachments filtrando per contentType 'text/html'
                    emailBuilder.body = ReadEmlJson?.html || ReadEmlJson.attachments?.filter(a => a.contentType.includes("text/html") && a.inline === true)[0]?.data || ReadEmlJson?.text;

                    // Recupera gli allegati
                    if (ReadEmlJson.attachments && ReadEmlJson.attachments.length > 0) {
                        emailBuilder.attachments = ReadEmlJson.attachments.map(attachment => ({
                            fileName: attachment.name || getFilenameByContentType(attachment.contentType),
                            contentType: attachment.contentType,
                            base64: attachment.data64 ? attachment.data64 : uint8ArrayToBase64(attachment.data),
                            inline: attachment.inline
                        }))?.filter(a => !(a.contentType.includes("text") && a.inline === true));
                    }
                    setEmailData(emailBuilder);
                }

                else {
                    throw new Error(err)
                }
            }
            catch (error) {
                toast.error(dictionary.get('responsePreviewKO').concat(': ', error))
            }
        });
    };

    return {
        emailData
    }
}