<#import "template.ftl" as layout>
<@layout.registrationLayout displayMessage=false; section>
    <#if section = "header">
        <#if messageHeader??>
            <p class="ss-subtitle">${kcSanitize(messageHeader)?no_esc}</p>
        <#else>
            <p class="ss-subtitle">${kcSanitize(message.summary)?no_esc}</p>
        </#if>
    <#elseif section = "form">
        <div class="ss-center">
            <#if message?has_content>
                <div class="ss-alert ss-alert-${message.type}">
                    ${kcSanitize(message.summary)?no_esc}
                </div>
            </#if>

            <#if skipLink??>
            <#else>
                <#if pageRedirectUri?has_content>
                    <a href="${pageRedirectUri}" class="ss-btn ss-btn-primary">${kcSanitize(msg("backToApplication"))?no_esc}</a>
                <#elseif actionUri?has_content>
                    <a href="${actionUri}" class="ss-btn ss-btn-primary">${kcSanitize(msg("proceedWithAction"))?no_esc}</a>
                <#elseif (client.baseUrl)?has_content>
                    <a href="${client.baseUrl}" class="ss-btn ss-btn-primary">${kcSanitize(msg("backToApplication"))?no_esc}</a>
                </#if>
            </#if>
        </div>
    </#if>
</@layout.registrationLayout>
