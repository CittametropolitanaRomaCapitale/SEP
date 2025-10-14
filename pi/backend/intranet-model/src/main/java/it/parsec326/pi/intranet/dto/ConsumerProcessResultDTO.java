package it.parsec326.pi.intranet.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConsumerProcessResultDTO {
    private String messageId;
    private boolean processed;
    private boolean alreadyProcessed;
    private List<String> infoMessages;

    public ConsumerProcessResultDTO(String messageId) {
        this.messageId = messageId;
        this.processed = false;
        this.alreadyProcessed = false;
        this.infoMessages = new ArrayList<>();
    }

    public void addInfoMessage(String message) {
        this.infoMessages.add(message);
    }
}
