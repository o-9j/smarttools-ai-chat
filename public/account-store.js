(() => {
  const css = `
  .st-modal-wrap{position:fixed;inset:0;z-index:9999;background:rgba(2,7,18,.78);backdrop-filter:blur(8px);display:grid;place-items:center;padding:18px}
  .st-modal{width:min(94vw,520px);max-height:88vh;overflow:auto;background:linear-gradient(180deg,#162846,#0d172a);border:1px solid #3c5b86;border-radius:24px;padding:20px;box-shadow:0 25px 90px rgba(0,0,0,.45)}
  .st-modal.hidden{display:none!important}.st-modal-wrap.hidden{display:none!important}
  .st-modal-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}.st-modal-head h2{margin:0}
  .st-close{width:42px;height:42px;border-radius:12px;border:1px solid #49688f;background:#101d33;color:white;font-size:20px}
  .st-tabs{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:12px 0}.st-tab{padding:11px;border-radius:12px;border:1px solid #395779;background:#0d1a30;color:#b7cbe5}.st-tab.active{background:#254b79;color:#fff;border-color:#5caeff}
  .st-field{display:block;margin:12px 0}.st-field span{display:block;font-size:12px;color:#b9cce4;margin-bottom:6px}.st-field input{width:100%;padding:13px;border-radius:12px;border:1px solid #496488;background:#0a1528;color:#fff}
  .st-wide{width:100%;margin-top:8px}.st-status{min-height:22px;margin-top:10px;font-size:12px;color:#a9c8eb;line-height:1.6}
  .st-account-card{padding:15px;border-radius:16px;border:1px solid #35557d;background:#0d1a30;margin:10px 0}.st-account-card strong{display:block;font-size:17px}.st-account-card small{display:block;color:#9fb6d2;margin-top:4px}
  .st-store-intro{padding:13px;border-radius:14px;background:#102844;border:1px solid #2c5e8d;color:#bfe1ff;font-size:13px;line-height:1.7;margin-bottom:12px}
  .st-plans{display:grid;gap:10px}.st-plan{padding:16px;border-radius:17px;border:1px solid #36567f;background:#0d1a30}.st-plan.best{border-color:#736dff;box-shadow:0 0 0 1px rgba(115,109,255,.25)}.st-plan-top{display:flex;align-items:center;justify-content:space-between;gap:10px}.st-plan h3{margin:0}.st-price{font-size:22px;font-weight:900;color:#85caff}.st-plan p{font-size:12px;color:#9fb5d0;margin:8px 0 12px;line-height:1.6}.st-free{font-size:12px;color:#9fc0df;margin:10px 0 14px}
  @media(max-width:560px){.actions{flex-wrap:wrap}.actions select{min-width:145px}.st-modal{padding:16px}}
  `;
  const style=document.createElement('style');style.textContent=css;document.head.appendChild(style);

  const actions=document.querySelector('.actions');
  const storeBtn=document.getElementById('premium');
  if(storeBtn) storeBtn.textContent = (typeof lang!=='undefined' && lang==='en') ? 'Store' : 'المتجر';
  const accountBtn=document.createElement('button');
  accountBtn.className='outline';
  accountBtn.id='accountBtn';
  accountBtn.textContent=(typeof lang!=='undefined' && lang==='en')?'Sign in':'دخول';
  if(actions) actions.appendChild(accountBtn);

  const wrap=document.createElement('div');
  wrap.className='st-modal-wrap hidden';
  wrap.id='stModalWrap';
  wrap.innerHTML=`
    <section class="st-modal hidden" id="stAuthModal">
      <div class="st-modal-head"><h2 id="stAuthTitle">الحساب</h2><button class="st-close" data-close>✕</button></div>
      <div id="stSignedOut">
        <div class="st-tabs">
          <button class="st-tab active" id="stLoginTab">تسجيل الدخول</button>
          <button class="st-tab" id="stRegisterTab">إنشاء حساب</button>
        </div>
        <label class="st-field hidden" id="stNameField"><span>الاسم</span><input id="stName" maxlength="80" autocomplete="name"></label>
        <label class="st-field"><span id="stEmailLabel">البريد الإلكتروني</span><input id="stEmail" type="email" autocomplete="email"></label>
        <label class="st-field"><span id="stPasswordLabel">كلمة المرور</span><input id="stPassword" type="password" minlength="8" autocomplete="current-password"></label>
        <button class="primary st-wide" id="stAuthSubmit">دخول</button>
        <div class="st-status" id="stAuthStatus"></div>
      </div>
      <div id="stSignedIn" class="hidden">
        <div class="st-account-card"><strong id="stUserName"></strong><small id="stUserEmail"></small><small id="stUserPlan"></small></div>
        <button class="outline st-wide" id="stLogout">تسجيل الخروج</button>
      </div>
    </section>
    <section class="st-modal hidden" id="stStoreModal">
      <div class="st-modal-head"><h2 id="stStoreTitle">متجر SmartTools AI</h2><button class="st-close" data-close>✕</button></div>
      <div class="st-store-intro" id="stStoreIntro">استخدم التطبيق مجاناً مع الإعلانات، أو اختر Premium لإزالة الإعلانات وفتح المزايا الإضافية.</div>
      <div class="st-free" id="stFreeText">الخطة المجانية: جميع الأدوات الأساسية + إعلانات.</div>
      <div class="st-plans">
        <div class="st-plan"><div class="st-plan-top"><h3 id="stWeeklyName">أسبوعي</h3><div class="st-price">$0.99</div></div><p id="stWeeklyText">Premium لمدة أسبوع.</p><button class="primary st-wide st-buy" data-plan="weekly">اشترك</button></div>
        <div class="st-plan best"><div class="st-plan-top"><h3 id="stMonthlyName">شهري</h3><div class="st-price">$2.99</div></div><p id="stMonthlyText">Premium لمدة شهر.</p><button class="primary st-wide st-buy" data-plan="monthly">اشترك</button></div>
        <div class="st-plan"><div class="st-plan-top"><h3 id="stYearlyName">سنوي</h3><div class="st-price">$19.99</div></div><p id="stYearlyText">أفضل قيمة لمدة سنة.</p><button class="primary st-wide st-buy" data-plan="yearly">اشترك</button></div>
      </div>
      <div class="st-status" id="stStoreStatus"></div>
    </section>`;
  document.body.appendChild(wrap);

  const q=s=>document.querySelector(s);
  let mode='login', currentUser=null;

  function isEn(){return typeof lang!=='undefined' && lang==='en'}
  function accountText(key,fallback){return ACCOUNT_WORDS[typeof lang!=='undefined'?lang:'ar']?.[key]||fallback}
  function accountText(key,fallback){return ACCOUNT_WORDS[typeof lang!=='undefined'?lang:'ar']?.[key]||fallback}
  const ACCOUNT_WORDS={"zh":{"store":"商店","signin":"登录","account":"账户","register":"创建账户","name":"姓名","email":"电子邮件","password":"密码","create":"创建账户","logout":"退出登录","storeTitle":"SmartTools AI 商店","intro":"免费使用 SmartTools AI 并观看广告，或选择 Premium 以移除广告并解锁更多功能。","freeText":"免费方案：基础工具 + 广告。","weekly":"每周","weeklyText":"Premium 有效期一周。","monthly":"每月","monthlyText":"Premium 有效期一个月。","yearly":"每年","yearlyText":"年度最佳优惠。","subscribe":"订阅","plan":"方案：","free":"免费","wait":"稍等…","signinSub":"请先登录再订阅。","db":"账户数据库需要先在 Cloudflare 中启用。","exists":"此邮箱已注册。","badLogin":"邮箱或密码不正确。","weak":"密码至少需要 8 个字符。","error":"发生错误，请重试。","created":"注册成功","signed":"登录成功","language":"语言"},"hi":{"store":"स्टोर","signin":"साइन इन","account":"खाता","register":"खाता बनाएँ","name":"नाम","email":"ईमेल","password":"पासवर्ड","create":"खाता बनाएँ","logout":"साइन आउट","storeTitle":"SmartTools AI स्टोर","intro":"SmartTools AI को विज्ञापनों के साथ मुफ़्त इस्तेमाल करें या विज्ञापन हटाने और अतिरिक्त सुविधाएँ पाने के लिए Premium चुनें।","freeText":"मुफ़्त योजना: मुख्य टूल + विज्ञापन।","weekly":"साप्ताहिक","weeklyText":"एक सप्ताह के लिए Premium।","monthly":"मासिक","monthlyText":"एक महीने के लिए Premium।","yearly":"वार्षिक","yearlyText":"एक वर्ष के लिए सबसे अच्छा मूल्य।","subscribe":"सदस्यता लें","plan":"योजना:","free":"मुफ़्त","wait":"कृपया प्रतीक्षा करें…","signinSub":"सदस्यता लेने के लिए पहले साइन इन करें।","db":"पहले Cloudflare में खाता डेटाबेस चालू करें।","exists":"यह ईमेल पहले से पंजीकृत है।","badLogin":"ईमेल या पासवर्ड गलत है।","weak":"पासवर्ड कम से कम 8 अक्षरों का होना चाहिए।","error":"कुछ गड़बड़ हुई। फिर कोशिश करें।","created":"खाता बन गया","signed":"साइन इन सफल","language":"भाषा"},"es":{"store":"Tienda","signin":"Iniciar sesión","account":"Cuenta","register":"Crear cuenta","name":"Nombre","email":"Correo electrónico","password":"Contraseña","create":"Crear cuenta","logout":"Cerrar sesión","storeTitle":"Tienda de SmartTools AI","intro":"Usa SmartTools AI gratis con anuncios o elige Premium para quitarlos y desbloquear funciones adicionales.","freeText":"Plan gratuito: herramientas principales + anuncios.","weekly":"Semanal","weeklyText":"Premium durante una semana.","monthly":"Mensual","monthlyText":"Premium durante un mes.","yearly":"Anual","yearlyText":"Mejor precio por un año.","subscribe":"Suscribirse","plan":"Plan:","free":"Gratis","wait":"Espera…","signinSub":"Inicia sesión primero para suscribirte.","db":"Primero hay que activar la base de datos de cuentas en Cloudflare.","exists":"Este correo ya está registrado.","badLogin":"El correo o la contraseña no son correctos.","weak":"La contraseña debe tener al menos 8 caracteres.","error":"Algo salió mal. Inténtalo de nuevo.","created":"Cuenta creada","signed":"Sesión iniciada","language":"Idioma"},"fr":{"store":"Boutique","signin":"Se connecter","account":"Compte","register":"Créer un compte","name":"Nom","email":"E-mail","password":"Mot de passe","create":"Créer un compte","logout":"Se déconnecter","storeTitle":"Boutique SmartTools AI","intro":"Utilisez SmartTools AI gratuitement avec des publicités ou choisissez Premium pour les supprimer et débloquer des options supplémentaires.","freeText":"Offre gratuite : outils essentiels + publicités.","weekly":"Hebdomadaire","weeklyText":"Premium pendant une semaine.","monthly":"Mensuel","monthlyText":"Premium pendant un mois.","yearly":"Annuel","yearlyText":"Meilleur prix pour un an.","subscribe":"S’abonner","plan":"Offre :","free":"Gratuit","wait":"Veuillez patienter…","signinSub":"Connectez-vous d’abord pour vous abonner.","db":"La base de données des comptes doit d’abord être activée dans Cloudflare.","exists":"Cette adresse e-mail est déjà enregistrée.","badLogin":"E-mail ou mot de passe incorrect.","weak":"Le mot de passe doit comporter au moins 8 caractères.","error":"Une erreur s’est produite. Réessayez.","created":"Compte créé","signed":"Connexion réussie","language":"Langue"},"bn":{"store":"স্টোর","signin":"সাইন ইন","account":"অ্যাকাউন্ট","register":"অ্যাকাউন্ট তৈরি","name":"নাম","email":"ইমেইল","password":"পাসওয়ার্ড","create":"অ্যাকাউন্ট তৈরি","logout":"সাইন আউট","storeTitle":"SmartTools AI স্টোর","intro":"বিজ্ঞাপনসহ বিনামূল্যে SmartTools AI ব্যবহার করুন, অথবা বিজ্ঞাপন সরিয়ে অতিরিক্ত সুবিধা পেতে Premium নিন।","freeText":"বিনামূল্যের প্ল্যান: মূল টুল + বিজ্ঞাপন।","weekly":"সাপ্তাহিক","weeklyText":"এক সপ্তাহের জন্য Premium।","monthly":"মাসিক","monthlyText":"এক মাসের জন্য Premium।","yearly":"বার্ষিক","yearlyText":"এক বছরের সেরা মূল্য।","subscribe":"সাবস্ক্রাইব","plan":"প্ল্যান:","free":"বিনামূল্যে","wait":"একটু অপেক্ষা করুন…","signinSub":"সাবস্ক্রাইব করতে আগে সাইন ইন করুন।","db":"আগে Cloudflare-এ অ্যাকাউন্ট ডেটাবেস চালু করতে হবে।","exists":"এই ইমেইল আগে থেকেই নিবন্ধিত।","badLogin":"ইমেইল বা পাসওয়ার্ড ভুল।","weak":"পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।","error":"সমস্যা হয়েছে। আবার চেষ্টা করুন।","created":"অ্যাকাউন্ট তৈরি হয়েছে","signed":"সাইন ইন সফল","language":"ভাষা"}};
  function localizeAccountStore(){
    const en=isEn(), w=ACCOUNT_WORDS[typeof lang!=='undefined'?lang:'ar'];
    if(storeBtn) storeBtn.textContent=w?.store||(en?'Store':'المتجر');
    accountBtn.textContent=currentUser?(currentUser.name||currentUser.email):(w?.signin||(en?'Sign in':'دخول'));
    q('#stAuthTitle').textContent=w?.account||(en?'Account':'الحساب');
    q('#stLoginTab').textContent=w?.signin||(en?'Sign in':'تسجيل الدخول');
    q('#stRegisterTab').textContent=w?.register||(en?'Create account':'إنشاء حساب');
    q('#stNameField span').textContent=w?.name||(en?'Name':'الاسم');
    q('#stEmailLabel').textContent=w?.email||(en?'Email':'البريد الإلكتروني');
    q('#stPasswordLabel').textContent=w?.password||(en?'Password':'كلمة المرور');
    q('#stAuthSubmit').textContent=mode==='login'?(w?.signin||(en?'Sign in':'دخول')):(w?.create||(en?'Create account':'إنشاء الحساب'));
    q('#stLogout').textContent=w?.logout||(en?'Sign out':'تسجيل الخروج');
    q('#stStoreTitle').textContent=w?.storeTitle||(en?'SmartTools AI Store':'متجر SmartTools AI');
    q('#stStoreIntro').textContent=w?.intro||(en?'Use SmartTools AI free with ads, or choose Premium to remove ads and unlock extra benefits.':'استخدم التطبيق مجاناً مع الإعلانات، أو اختر Premium لإزالة الإعلانات وفتح المزايا الإضافية.');
    q('#stFreeText').textContent=w?.freeText||(en?'Free plan: core tools + ads.':'الخطة المجانية: جميع الأدوات الأساسية + إعلانات.');
    q('#stWeeklyName').textContent=w?.weekly||(en?'Weekly':'أسبوعي');q('#stWeeklyText').textContent=w?.weeklyText||(en?'Premium for one week.':'Premium لمدة أسبوع.');
    q('#stMonthlyName').textContent=w?.monthly||(en?'Monthly':'شهري');q('#stMonthlyText').textContent=w?.monthlyText||(en?'Premium for one month.':'Premium لمدة شهر.');
    q('#stYearlyName').textContent=w?.yearly||(en?'Yearly':'سنوي');q('#stYearlyText').textContent=w?.yearlyText||(en?'Best value for one year.':'أفضل قيمة لمدة سنة.');
    document.querySelectorAll('.st-buy').forEach(b=>b.textContent=w?.subscribe||(en?'Subscribe':'اشترك'));
    if(currentUser){q('#stUserPlan').textContent=(w?.plan||(en?'Plan: ':'الخطة: '))+(currentUser.plan==='free'?(w?.free||(en?'Free':'مجانية')):currentUser.plan)}
  }
  function show(which){
    wrap.classList.remove('hidden');
    q('#stAuthModal').classList.toggle('hidden',which!=='auth');
    q('#stStoreModal').classList.toggle('hidden',which!=='store');
    localizeAccountStore();
  }
  function hide(){wrap.classList.add('hidden');q('#stAuthModal').classList.add('hidden');q('#stStoreModal').classList.add('hidden')}
  wrap.addEventListener('click',e=>{if(e.target===wrap||e.target.closest('[data-close]'))hide()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')hide()});
  document.addEventListener('smarttools-language-change',localizeAccountStore);

  function setMode(next){
    mode=next;
    q('#stLoginTab').classList.toggle('active',mode==='login');
    q('#stRegisterTab').classList.toggle('active',mode==='register');
    q('#stNameField').classList.toggle('hidden',mode!=='register');
    q('#stPassword').autocomplete=mode==='login'?'current-password':'new-password';
    q('#stAuthStatus').textContent='';
    localizeAccountStore();
  }

  async function api(path,options={}){
    const r=await fetch(path,{credentials:'same-origin',headers:{'Content-Type':'application/json',...(options.headers||{})},...options});
    let data={};try{data=await r.json()}catch(e){}
    if(!r.ok){const err=new Error(data.message||'Request failed');err.code=data.error;err.status=r.status;throw err}
    return data;
  }

  async function refreshUser(){
    try{
      const d=await api('/api/auth/me',{method:'GET',headers:{}});
      currentUser=d.user||null;
    }catch(e){
      if(e.code==='accounts_not_configured') currentUser=null;
    }
    q('#stSignedOut').classList.toggle('hidden',!!currentUser);
    q('#stSignedIn').classList.toggle('hidden',!currentUser);
    if(currentUser){
      q('#stUserName').textContent=currentUser.name||'';
      q('#stUserEmail').textContent=currentUser.email||'';
    }
    localizeAccountStore();
  }

  accountBtn.onclick=async()=>{await refreshUser();show('auth')};
  if(storeBtn) storeBtn.onclick=()=>show('store');
  q('#stLoginTab').onclick=()=>setMode('login');
  q('#stRegisterTab').onclick=()=>setMode('register');

  q('#stAuthSubmit').onclick=async()=>{
    const status=q('#stAuthStatus');
    const name=q('#stName').value.trim(),email=q('#stEmail').value.trim(),password=q('#stPassword').value;
    status.textContent=accountText('wait',isEn()?'Please wait…':'لحظة…');
    try{
      const body=mode==='register'?{name,email,password}:{email,password};
      const d=await api('/api/auth/'+(mode==='register'?'register':'login'),{method:'POST',body:JSON.stringify(body)});
      currentUser=d.user;
      await refreshUser();
      status.textContent='';
    }catch(e){
      if(e.code==='accounts_not_configured') status.textContent=accountText('db',isEn()?'Account database needs to be enabled in Cloudflare first.':'نحتاج نفعّل قاعدة بيانات الحسابات في Cloudflare أولاً.');
      else if(e.code==='email_exists') status.textContent=accountText('exists',isEn()?'This email is already registered.':'هذا البريد مسجل من قبل.');
      else if(e.code==='invalid_login') status.textContent=accountText('badLogin',isEn()?'Email or password is incorrect.':'البريد أو كلمة المرور غير صحيحة.');
      else if(e.code==='weak_password') status.textContent=accountText('weak',isEn()?'Password must be at least 8 characters.':'كلمة المرور لازم تكون 8 أحرف على الأقل.');
      else status.textContent=accountText('error',isEn()?'Something went wrong.':'صار خطأ، جرّب مرة ثانية.');
    }
  };

  q('#stLogout').onclick=async()=>{try{await api('/api/auth/logout',{method:'POST',body:'{}'})}catch(e){}currentUser=null;await refreshUser();setMode('login')};

  document.querySelectorAll('.st-buy').forEach(btn=>btn.addEventListener('click',async()=>{
    await refreshUser();
    const status=q('#stStoreStatus');
    if(!currentUser){
      status.textContent=accountText('signinSub',isEn()?'Sign in first to subscribe.':'سجّل دخولك أولاً للاشتراك.');
      setTimeout(()=>show('auth'),500);
      return;
    }
    const plan=btn.dataset.plan;
    status.textContent=isEn()
      ?'The store screen is ready. Real App Store / Google Play payment will be connected when the native iOS/Android build is prepared.'
      :'واجهة المتجر جاهزة. الدفع الحقيقي من App Store وGoogle Play نربطه عند تجهيز نسخة iOS وAndroid.';
    status.dataset.plan=plan||'';
  }));

  const langSelect=document.getElementById('lang');
  if(langSelect) langSelect.addEventListener('change',()=>setTimeout(localizeAccountStore,0));
  setMode('login');refreshUser();
})();