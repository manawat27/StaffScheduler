<#import "template.ftl" as layout>
<@layout.registrationLayout; section>
    <#if section = "header">
        <p class="ss-subtitle">${msg("pageExpiredTitle")}</p>
    <#elseif section = "form">
        <div class="ss-center">
            <p class="ss-text">${msg("pageExpiredMsg1")}</p>
            <div class="ss-actions">
                <a id="loginRestartLink" href="${url.loginRestartFlowUrl}" class="ss-btn ss-btn-primary">${msg("doTryAgain")}</a>
            </div>
            <p class="ss-text" style="margin-top: 1.25rem;">${msg("pageExpiredMsg2")}</p>
            <div class="ss-actions">
                <a id="loginContinueLink" href="${url.loginAction}" class="ss-btn ss-btn-outline">${msg("doContinue")}</a>
            </div>
        </div>
    </#if>
</@layout.registrationLayout>
