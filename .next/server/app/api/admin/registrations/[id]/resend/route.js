"use strict";(()=>{var e={};e.id=10,e.ids=[10],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},8678:e=>{e.exports=import("pg")},9491:e=>{e.exports=require("assert")},4300:e=>{e.exports=require("buffer")},7147:e=>{e.exports=require("fs")},5218:e=>{e.exports=require("node:child_process")},6005:e=>{e.exports=require("node:crypto")},604:e=>{e.exports=require("node:dns")},5673:e=>{e.exports=require("node:events")},7561:e=>{e.exports=require("node:fs")},3977:e=>{e.exports=require("node:fs/promises")},8849:e=>{e.exports=require("node:http")},2286:e=>{e.exports=require("node:https")},7503:e=>{e.exports=require("node:net")},612:e=>{e.exports=require("node:os")},9411:e=>{e.exports=require("node:path")},4492:e=>{e.exports=require("node:stream")},1764:e=>{e.exports=require("node:tls")},3020:e=>{e.exports=require("node:url")},7261:e=>{e.exports=require("node:util")},5628:e=>{e.exports=require("node:zlib")},2781:e=>{e.exports=require("stream")},3837:e=>{e.exports=require("util")},9796:e=>{e.exports=require("zlib")},9587:(e,t,r)=>{r.a(e,async(e,i)=>{try{r.r(t),r.d(t,{originalPathname:()=>h,patchFetch:()=>d,requestAsyncStorage:()=>p,routeModule:()=>c,serverHooks:()=>u,staticGenerationAsyncStorage:()=>l});var a=r(9303),s=r(8716),n=r(670),o=r(708),m=e([o]);o=(m.then?(await m)():m)[0];let c=new a.AppRouteRouteModule({definition:{kind:s.x.APP_ROUTE,page:"/api/admin/registrations/[id]/resend/route",pathname:"/api/admin/registrations/[id]/resend",filename:"route",bundlePath:"app/api/admin/registrations/[id]/resend/route"},resolvedPagePath:"/home/santhosh/Work/agentx/backend/app/api/admin/registrations/[id]/resend/route.ts",nextConfigOutput:"",userland:o}),{requestAsyncStorage:p,staticGenerationAsyncStorage:l,serverHooks:u}=c,h="/api/admin/registrations/[id]/resend/route";function d(){return(0,n.patchFetch)({serverHooks:u,staticGenerationAsyncStorage:l})}i()}catch(e){i(e)}})},708:(e,t,r)=>{r.a(e,async(e,i)=>{try{r.r(t),r.d(t,{POST:()=>l});var a=r(4745),s=r(6938),n=r(6074),o=r(1940),m=r(1541),d=r(2490),c=r(7176),p=e([s]);s=(p.then?(await p)():p)[0];let l=(0,o.BC)(async(e,t)=>{await (0,n.k)(e);let r=(0,s.GY)(),{id:i}=t.params,p=(0,n.$)(e),l=await r.query(`SELECT id, team_name, team_code, institution, track_id, registration_status, payment_status
     FROM public.teams WHERE id = $1`,[i]);if(0===l.rows.length)return(0,o.bG)(404,"Registration not found.");let u=l.rows[0];if("CONFIRMED"!==u.registration_status||"VERIFIED"!==u.payment_status)return(0,o.bG)(409,"Only confirmed registrations can receive tickets. Verify payment first.");let h=await r.query(`SELECT k.id, k.ticket_id, k.qr_token, k.ticket_status, k.pdf_path, k.pdf_filename, k.pdf_status,
            m.id AS member_id, m.full_name, m.email, m.is_lead
     FROM public.tickets k
     JOIN public.members m ON m.id = k.member_id
     WHERE k.team_id = $1 AND k.ticket_status <> 'CANCELLED'
     ORDER BY m.is_lead DESC, m.created_at ASC`,[i]);if(0===h.rows.length)return(0,o.bG)(422,"No usable tickets for this team. Re-verify payment to regenerate.");let f=h.rows.map(e=>({id:e.id,ticketId:e.ticket_id,memberId:e.member_id,memberName:e.full_name,memberEmail:e.email,qrToken:e.qr_token,ticketStatus:e.ticket_status,pdfPath:e.pdf_path??"",pdfFilename:e.pdf_filename??"",pdfStatus:e.pdf_status??"PENDING"})),g=h.rows.find(e=>e.is_lead&&e.email)??h.rows.find(e=>e.email)??h.rows[0],y=await (0,d.Bj)(r,i,{teamName:u.team_name,institution:u.institution,trackId:u.track_id,venue:a.Ey.venue,eventDate:a.Ey.datesDisplay},f),b=g.full_name.trim().split(/\s+/)[0]||"there",x=(0,m.vq)({teamName:u.team_name,teamCode:u.team_code,leaderName:b,members:f.map(e=>({name:e.memberName,ticketId:e.ticketId,pdfFilename:e.pdfFilename||(0,c.Dr)(e.memberName)})),venue:a.Ey.venue,dates:a.Ey.datesDisplay}),k=await (0,m.Yb)({to:g.email,subject:x.subject,html:x.html,text:x.text,attachments:y});return(await r.query("UPDATE public.teams SET confirmation_email_status = $1 WHERE id = $2",["SENT"===k.status?"SENT":"FAILED",i]),await r.query(`INSERT INTO public.payment_decisions (team_id, decision, reason, admin_identity)
     VALUES ($1,'CONFIRMATION_RESENT',$2,$3)`,[i,"SENT"===k.status?`confirmation email re-sent with ${y.length} PDF attachments`:`resend failed: ${k.error??"SMTP error"}`,p]),"SENT"!==k.status)?(0,o.bG)(502,`Email delivery failed: ${k.error??"SMTP error"}`):(0,o.ok)({emailed:1,pdfCount:y.length})});i()}catch(e){i(e)}})},6074:(e,t,r)=>{r.d(t,{$:()=>n,k:()=>s});var i=r(6005),a=r(565);async function s(e){let t=process.env.ADMIN_TOKEN;if(!t)throw new a.o(503,"Admin access is not configured (ADMIN_TOKEN missing).");let r=e.headers.get("authorization")??"",s=r.startsWith("Bearer ")?r.slice(7).trim():"",n=Buffer.from(t),o=Buffer.from(s);if(!(n.length===o.length&&(0,i.timingSafeEqual)(n,o)))throw new a.o(401,"Invalid access token.")}function n(e){let t=e.headers.get("authorization")??"",r=t.startsWith("Bearer ")?t.slice(7).trim():"unknown",a=(0,i.createHash)("sha256").update(r).digest("hex").slice(0,8);return`admin:${a}`}},1541:(e,t,r)=>{r.d(t,{B6:()=>c,Yb:()=>s,ro:()=>m,vq:()=>d});var i=r(8892);let a=null;async function s(e){if(!(process.env.SMTP_USER?.trim()&&process.env.SMTP_PASSWORD?.trim())){let t=e.attachments?.map(e=>e.filename).join(", ")||"none";return console.info(`[email:dev] to=${e.to} subject="${e.subject}" attachments=${e.attachments?.length??0} [${t}]`),{status:"SENT"}}try{return await (a??=i.ZP.createTransport({host:process.env.SMTP_HOST?.trim()||"smtp.gmail.com",port:Number(process.env.SMTP_PORT??587),secure:465===Number(process.env.SMTP_PORT??587),auth:{user:process.env.SMTP_USER.trim(),pass:process.env.SMTP_PASSWORD.trim()}})).sendMail({from:process.env.EMAIL_FROM?.trim()||"TechSiege <cynex.depticb@gmail.com>",to:e.to,subject:e.subject,html:e.html,text:e.text,...e.attachments?.length?{attachments:e.attachments}:{}}),{status:"SENT"}}catch(e){return{status:"FAILED",error:e instanceof Error?e.message:"SMTP send failed"}}}function n(e,t=""){let r=e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").split(/\n{2,}/).map(e=>`<p style="margin:0 0 14px;line-height:1.65">${e.replace(/\n/g,"<br>")}</p>`).join("");return`<div style="font-family:ui-sans-serif,system-ui,sans-serif;max-width:560px;margin:0 auto;color:#e8ecf1;background:#0a0c10;padding:28px;border:1px solid #202634;border-radius:12px"><p style="margin:0 0 18px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#22d3ee">TechSiege 2026</p>${r}${t}<hr style="border:none;border-top:1px solid #202634;margin:22px 0"><p style="margin:0;font-size:12px;color:#7d8799">Questions? Reply to this email or write to cynex.depticb@gmail.com.</p></div>`}function o(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function m(e){let t=`Hi ${e.leaderName},

Thank you for registering for TechSiege 2026! We have received your registration details and payment submission.

Team: ${e.teamName}
Team Code: ${e.teamCode}

Our team is currently verifying your payment details. Once verified, you will receive a confirmation email with individual PDF tickets attached for each team member.`;return{subject:"TechSiege 2026 — Registration Received",html:n(t),text:t}}function d(e){let t=e.members.map(e=>`• ${e.name} — Ticket ID: ${e.ticketId} (Attached: ${e.pdfFilename})`).join("\n"),r=e.members.map(e=>`<li style="margin-bottom:8px"><strong>${o(e.name)}</strong> — Ticket ID: <span style="font-family:monospace;color:#22d3ee">${o(e.ticketId)}</span><br><span style="font-size:12px;color:#94a3b8">📎 ${o(e.pdfFilename)}</span></li>`).join(""),i=`Hi ${e.leaderName},

Your payment has been verified and your team's registration for TechSiege 2026 is officially CONFIRMED!

Your individual admission ticket PDFs are attached to this email. Each team member has a separate ticket containing their unique ticket ID and check-in QR code.

Team: ${e.teamName}
Team Code: ${e.teamCode}

Attached Member Tickets:
${t}

Event Dates: ${e.dates}
Venue: ${e.venue}

Check-In Instructions:
Every participant must present their personal ticket QR code (from their attached PDF) at the registration desk on event day. You may show the QR code directly from your smartphone or bring a printed copy.

Please ensure all team members bring their college ID card, laptop, and charger.

See you at TechSiege 2026!`;return{subject:"TechSiege 2026 — Registration Confirmed & Tickets",html:n(i,`
<div style="background:#111622;border:1px solid #202b3d;border-radius:8px;padding:16px;margin:18px 0">
  <p style="margin:0 0 10px;font-size:13px;font-weight:bold;color:#22d3ee;text-transform:uppercase;letter-spacing:.05em">Attached Member Ticket PDFs (${e.members.length}):</p>
  <ul style="margin:0;padding-left:18px;color:#e2e8f0;font-size:13px;line-height:1.6">
    ${r}
  </ul>
</div>
`),text:i}}function c(e){let t=`Hi ${e.leaderName},

The Ops team reviewed your TechSiege payment but could not verify it yet. Please submit your payment proof again.

Team: ${e.teamName}
Reference ID: ${e.teamCode}

What to fix: ${e.reason}

No tickets have been issued — they will follow once your payment is verified. Reply to this email if you need help.`;return{subject:"TechSiege 2026 — Payment Proof Needed Again",html:n(t),text:t}}}};var t=require("../../../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),i=t.X(0,[13,483,892,818],()=>r(9587));module.exports=i})();