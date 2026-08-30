import { ArrowLeft, Mail } from "lucide-react";

const contactEmail = "disconnectaudio@sina.com";

export const metadata = {
  title: "Privacy / DISCONNECT+",
  description: "Privacy and order intent handling notes for DISCONNECT+."
};

export default function PrivacyPage() {
  return (
    <main className="policy-page">
      <header className="policy-hero">
        <a className="ghost-button" href="/">
          <ArrowLeft size={16} />
          DISCONNECT+
        </a>
        <span className="eyebrow">Privacy / orders</span>
        <h1>隐私说明</h1>
        <p>
          本页说明 DISCONNECT+ 网站如何处理预约、购买意向、合作联系和基础访问数据。
          当前版本不处理在线支付，也不会公开显示访客提交的联系方式。
        </p>
      </header>

      <section className="policy-section">
        <h2>我们会收集什么</h2>
        <p>
          当你提交商店、插件咨询、Noise Box 报名或野外电燥报名时，网站会保存你填写的姓名或代号、
          联系方式、选择的项目、数量和备注。联系方式可以是邮箱、微信、电话或你主动留下的其他方式。
        </p>
        <p>
          网站还使用 Cloudflare Turnstile 做反机器人验证，并由 Cloudflare Pages 和 D1 提供托管与数据存储。
          Cloudflare 可能会处理必要的访问日志、网络请求信息和验证码验证信息。
        </p>
      </section>

      <section className="policy-section">
        <h2>这些信息怎么用</h2>
        <p>
          提交信息只用于联系你、确认预约、处理购买意向、安排活动名额、发送插件相关说明或回应合作请求。
          我们不会把订单意向和联系方式公开展示，也不会出售给第三方。
        </p>
      </section>

      <section className="policy-section">
        <h2>后台和安全</h2>
        <p>
          后台管理入口由 Cloudflare Access 和管理员邮箱白名单保护。公开访客不能查看后台订单列表，
          也不能读取或修改网站管理数据。公开预约接口需要 Turnstile 验证，并限制字段长度。
        </p>
      </section>

      <section className="policy-section">
        <h2>保留和删除</h2>
        <p>
          预约和联系信息会保留到对应活动、订单或合作沟通结束后的一段合理时间。你可以通过邮件要求查询、
          更正或删除自己提交的信息。
        </p>
        <a className="text-button" href={`mailto:${contactEmail}`}>
          <Mail size={16} />
          {contactEmail}
        </a>
      </section>

      <section className="policy-section policy-section-en">
        <h2>English Summary</h2>
        <p>
          DISCONNECT+ uses submitted order, signup, plugin inquiry, and booking details only to contact you and
          handle the related request. Contact details are not published. The site runs on Cloudflare Pages, D1,
          and Turnstile; Cloudflare may process necessary request and verification data. Admin areas are protected
          by Cloudflare Access and an email allowlist.
        </p>
      </section>
    </main>
  );
}
