import { useGetApiAdminRoleUserByUserIdQuery } from "@cmrc/services/sso"
import { useAuth } from "@cmrc/ui/hooks/use-auth"

export const useAdmin = () => {
  const { user } = useAuth()
  // Recupera i ruoli di amministrazione tramite l'user_id
  const { data: adminRoles } = useGetApiAdminRoleUserByUserIdQuery(
    { 
      userId: user?.selectedOffice?.user_id 
    },  
    {
      skip: !(user?.selectedOffice?.user_id),
    }
  )
  
  return {
    adminRoles
  }
}