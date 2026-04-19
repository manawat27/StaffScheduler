<#import "template.ftl" as layout>
<@layout.registrationLayout displayMessage=true; section>
    <#if section = "header">
        <p class="ss-subtitle">${kcSanitize(msg("errorTitle"))?no_esc}</p>
    <#elseif section = "form">
        <div class="ss-center">
            <#if skipLink??>
            <#else>
                <#if client?? && client.baseUrl?has_content>
                    <a id="backToApplication" href="${client.baseUrl}" class="ss-btn ss-btn-primary">${kcSanitize(msg("backToApplication"))?no_esc}</a>
                </#if>
            </#if>
        </div>
    </#if>
</@layout.registrationLayout>
