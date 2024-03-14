# Terms

## Authority
```
@Entity(name = "authorities")
public class Authority {
```
Spring Security uses an authorities table to manage access permissions for users, to see for which actions they are authorized (if a user is not authorized for an action, the application will return a 403 Forbidden). Originally, an authority was a String specifying a permission, like "READ", "WRITE" or "DELETE", or something like "CREATE_POST". Nowadays, people often use the Authority table for roles, like "USER", "ADMIN", "MANAGER", though, to distinguish "classical" authorities (of which a user could have multiple) from roles, roles have to be prefixed with "ROLE_", so "ROLE_USER", "ROLE_ADMIN", "ROLE_MANAGER". 
Spring JDBC by default requires an "authorities" table to function.