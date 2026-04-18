<#import "template.ftl" as layout>
<@layout.registrationLayout displayInfo=true; section>
    <#if section = "header">
        <p class="ss-subtitle">${msg("emailVerifyTitle")}</p>
    <#elseif section = "form">
        <p class="ss-text">${msg("emailVerifyInstruction1",(user.email!''))}</p>
    <#elseif section = "info">
        <p class="ss-text">
            ${msg("emailVerifyInstruction2")}
            <br/><br/>
            <a href="${url.loginAction}" class="ss-link">${msg("doClickHere")}</a> ${msg("emailVerifyInstruction3")}
        </p>
    </#if>
</@layout.registrationLayout>
