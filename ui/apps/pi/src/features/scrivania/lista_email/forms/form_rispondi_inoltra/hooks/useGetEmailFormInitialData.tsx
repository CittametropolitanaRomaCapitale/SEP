import { EmailBaseFragment } from "@cmrc/services/src/app/piapi/generated"
import { EmailFormData } from "./useEmailForm"
import { buildBody, transformEmailString } from "../../../../../../utils/email_utilities"
import { EmailActionType } from "../../../../../../store/email/emailSlice"

export const useGetEmailFormInitialData = (
    emailData: EmailBaseFragment, 
    emailAction: EmailActionType | null
    = null
  ) => {
    
    let initialData: EmailFormData;
    switch(emailAction) {
      case "REPLY" : 
        initialData = {
          corpo: buildBody(emailData),
          destinatariTo: emailData.from ? transformEmailString(emailData.from) : undefined,
          destinatariCc: emailData.cc ? transformEmailString(emailData.cc) : undefined,
          from: emailData.to,
          idUtente: undefined,
          idAttachments: [],
          oggetto: emailData?.oggetto ?  `Re: ${emailData.oggetto}` : undefined,
          tipologiaPosta: emailData?.tipoEmail ? emailData.tipoEmail : undefined
        }
      break;

      case "FORWARD" : 
        initialData = {
          corpo: buildBody(emailData),
          destinatariTo: undefined,
          destinatariCc: undefined,
          idUtente: undefined,
          idAttachments: [],
          from: emailData.to,
          oggetto: emailData?.oggetto ?  `Fw: ${emailData.oggetto}` : undefined,
          tipologiaPosta: emailData?.tipoEmail ? emailData.tipoEmail : undefined
        }
      break;

      default: break;
    }
    
return {initialData}
}