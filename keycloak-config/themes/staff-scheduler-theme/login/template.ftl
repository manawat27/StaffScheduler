<#macro registrationLayout bodyClass="" displayInfo=false displayMessage=true displayRequiredFields=false showAnotherWayIfPresent=true>
<!DOCTYPE html>
<html<#if locale??> lang="${locale.currentLanguageTag}"</#if>>
<head>
    <meta charset="utf-8">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="robots" content="noindex, nofollow">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${msg("loginTitle",(realm.displayName!''))}</title>
    <#if properties.stylesCommon?has_content>
        <#list properties.stylesCommon?split(' ') as style>
            <link href="${url.resourcesCommonPath}/${style}" rel="stylesheet" />
        </#list>
    </#if>
    <#if properties.styles?has_content>
        <#list properties.styles?split(' ') as style>
            <link href="${url.resourcesPath}/${style}" rel="stylesheet" />
        </#list>
    </#if>
    <link href="${url.resourcesPath}/css/styles.css" rel="stylesheet" />
    <#if properties.scripts?has_content>
        <#list properties.scripts?split(' ') as script>
            <script src="${url.resourcesPath}/${script}" type="text/javascript"></script>
        </#list>
    </#if>
    <#if scripts??>
        <#list scripts as script>
            <script src="${script}" type="text/javascript"></script>
        </#list>
    </#if>
</head>
<body class="ss-body ${bodyClass}">
    <div class="ss-page">
        <div class="ss-container">
            <div class="ss-card">
                <div class="ss-header">
                    <h1 class="ss-title">${kcSanitize(msg("loginTitleHtml",(realm.displayNameHtml!realm.displayName!'')))?no_esc}</h1>
                    <#nested "header">
                </div>

                <#if displayMessage && message?has_content && (message.type != 'warning' || !isAppInitiatedAction??)>
                    <div class="ss-alert ss-alert-${message.type}">
                        ${kcSanitize(message.summary)?no_esc}
                    </div>
                </#if>

                <div class="ss-form-container">
                    <#nested "form">
                </div>

                <#if displayInfo>
                    <div class="ss-info">
                        <#nested "info">
                    </div>
                </#if>

                <#nested "socialProviders">
            </div>

            <div class="ss-footer">
                &copy; 2026 Staff Scheduler
            </div>
        </div>
    </div>
</body>
</html>
</#macro>
