from adal import AuthenticationContext
from msrestazure.azure_active_directory import AADTokenCredentials
from azure.profiles import KnownProfiles
from azure.keyvault import KeyVaultClient, KeyVaultId
from datetime import datetime, timedelta

KnownProfiles.default.use(KnownProfiles.v2019_03_01_hybrid)

def secclient(secname):

    # Define our keyvault manually
    kv_svc = "KEYVAULT URL"
    # Define vault resource
    kv_res = "KEYVAULT API RESOURCE URL"
    # Get credentials for Key Vault using devoper
    kvcred = credsdk(kv_res)

    # Initiate the KeyVault Secrets Client
    secclient = KeyVaultClient(kvcred)

    try:
        secret = secclient.get_secret(
            kv_svc, secname, secret_version=KeyVaultId.version_none)
        secval = secret.value  # actual secret

    except:
        secval = 'Unknown'

    return secval

def adal(resource):
    """
    Gets authentication token
    """
    ####### Authenticate with Microsoft to get a token key for the Service Principal 
    auth_context = AuthenticationContext("TENANTID URL")
    authjson = auth_context.acquire_token_with_client_certificate(resource, clientid, certificate, thumbprint)
    token = authjson["accessToken"]
    ######## Authenticate with Azurestack using the global token picked up above and using the parameters depending on what stack was selected (we loop through the list) #####

    return token


def credsdk(resource):
    """
    get_credentials prepares credentials to connect to Azure Cloud/Stack API
    """
    auth_context = AuthenticationContext("TENANTID URL")
    authjson = auth_context.acquire_token_with_client_certificate(resource, clientid, certificate, thumbprint)
    credentials = AADTokenCredentials(authjson, clientid)
    
    return credentials

### ACCOUNT FROM READING KEYVAULT SECRETS
clientid = '' 
tenantid = ''
certificate = ''
thumbprint = ''

### ACCOUT FOR LOGIN APP USING AZURE AD ####
redirect_uri = 'https://localhost/getAToken'
opsloginid = ''
opsloginob = ''
opsloginsec = secclient('NAME OF SECRET IN KEYVAULT')

AUTHORITY = 'TENANT ID URL'
REDIRECT_PATH = "/getAToken"  # It will be used to form an absolute URL
# And that absolute URL must match your app's redirect_uri set in AAD
# This is the resource that you are going to access in your B2C tenant
ENDPOINT = ''
# These are the scopes that you defined for the web API
SCOPE = ["User.ReadBasic.All"]
#### END AZURE AD ####



