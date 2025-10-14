package it.parsec326.pi.email.pec_queue;

import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.angus.mail.iap.ProtocolException;
import org.eclipse.angus.mail.iap.Response;
import org.eclipse.angus.mail.imap.IMAPFolder;
import org.eclipse.angus.mail.imap.protocol.BODY;
import org.eclipse.angus.mail.imap.protocol.FetchResponse;
import org.eclipse.angus.mail.imap.protocol.IMAPProtocol;

import java.io.ByteArrayInputStream;
import java.io.IOException;

@Slf4j
public class PecEmailFetcher implements IMAPFolder.ProtocolCommand {

    @Setter
    private int msgNumber;

    @Getter
    private byte[] emlContent;

    public PecEmailFetcher() {
        this.msgNumber = -1;
    }

    @Override
    public Object doCommand(IMAPProtocol protocol) throws ProtocolException {
        Response[] responses = protocol.fetch(msgNumber, msgNumber, "BODY[]");

        Response lastResponse = responses[responses.length - 1];
        if (lastResponse.isOK()) {
            BODY body;
            ByteArrayInputStream inputStream = null;

            try {
                StringBuilder sbEmlContent = new StringBuilder();
                for (int i = 0; i < responses.length - 1; i++) {
                    if (responses[i] instanceof FetchResponse fetchResponse) {
                        body = (BODY) fetchResponse.getItem(0);
                        inputStream = body.getByteArrayInputStream();

                        byte[] buffer = new byte[8192];
                        int bytesRead;
                        while ((bytesRead = inputStream.read(buffer)) != -1) {
                            sbEmlContent.append(new String(buffer, 0, bytesRead));
                        }
                    }
                }
                emlContent = sbEmlContent.toString().getBytes();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        protocol.notifyResponseHandlers(responses);
        protocol.handleResult(lastResponse);

        return "" + (responses.length - 1);
    }
}