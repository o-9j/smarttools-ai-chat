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
  function localizeAccountStore(){
    const en=isEn();
    if(storeBtn) storeBtn.textContent=en?'Store':'المتجر';
    accountBtn.textContent=currentUser?(currentUser.name||currentUser.email):(en?'Sign in':'دخول');
    q('#stAuthTitle').textContent=en?'Account':'الحساب';
    q('#stLoginTab').textContent=en?'Sign in':'تسجيل الدخول';
    q('#stRegisterTab').textContent=en?'Create account':'إنشاء حساب';
    q('#stNameField span').textContent=en?'Name':'الاسم';
    q('#stEmailLabel').textContent=en?'Email':'البريد الإلكتروني';
    q('#stPasswordLabel').textContent=en?'Password':'كلمة المرور';
    q('#stAuthSubmit').textContent=mode==='login'?(en?'Sign in':'دخول'):(en?'Create account':'إنشاء الحساب');
    q('#stLogout').textContent=en?'Sign out':'تسجيل الخروج';
    q('#stStoreTitle').textContent=en?'SmartTools AI Store':'متجر SmartTools AI';
    q('#stStoreIntro').textContent=en?'Use SmartTools AI free with ads, or choose Premium to remove ads and unlock extra benefits.':'استخدم التطبيق مجاناً مع الإعلانات، أو اختر Premium لإزالة الإعلانات وفتح المزايا الإضافية.';
    q('#stFreeText').textContent=en?'Free plan: core tools + ads.':'الخطة المجانية: جميع الأدوات الأساسية + إعلانات.';
    q('#stWeeklyName').textContent=en?'Weekly':'أسبوعي';q('#stWeeklyText').textContent=en?'Premium for one week.':'Premium لمدة أسبوع.';
    q('#stMonthlyName').textContent=en?'Monthly':'شهري';q('#stMonthlyText').textContent=en?'Premium for one month.':'Premium لمدة شهر.';
    q('#stYearlyName').textContent=en?'Yearly':'سنوي';q('#stYearlyText').textContent=en?'Best value for one year.':'أفضل قيمة لمدة سنة.';
    document.querySelectorAll('.st-buy').forEach(b=>b.textContent=en?'Subscribe':'اشترك');
    if(currentUser){q('#stUserPlan').textContent=(en?'Plan: ':'الخطة: ')+(currentUser.plan==='free'?(en?'Free':'مجانية'):currentUser.plan)}
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
    status.textContent=isEn()?'Please wait…':'لحظة…';
    try{
      const body=mode==='register'?{name,email,password}:{email,password};
      const d=await api('/api/auth/'+(mode==='register'?'register':'login'),{method:'POST',body:JSON.stringify(body)});
      currentUser=d.user;
      await refreshUser();
      status.textContent='';
    }catch(e){
      if(e.code==='accounts_not_configured') status.textContent=isEn()?'Account database needs to be enabled in Cloudflare first.':'نحتاج نفعّل قاعدة بيانات الحسابات في Cloudflare أولاً.';
      else if(e.code==='email_exists') status.textContent=isEn()?'This email is already registered.':'هذا البريد مسجل من قبل.';
      else if(e.code==='invalid_login') status.textContent=isEn()?'Email or password is incorrect.':'البريد أو كلمة المرور غير صحيحة.';
      else if(e.code==='weak_password') status.textContent=isEn()?'Password must be at least 8 characters.':'كلمة المرور لازم تكون 8 أحرف على الأقل.';
      else status.textContent=e.message||((isEn()?'Something went wrong.':'صار خطأ، جرّب مرة ثانية.'));
    }
  };

  q('#stLogout').onclick=async()=>{try{await api('/api/auth/logout',{method:'POST',body:'{}'})}catch(e){}currentUser=null;await refreshUser();setMode('login')};

  document.querySelectorAll('.st-buy').forEach(btn=>btn.addEventListener('click',async()=>{
    await refreshUser();
    const status=q('#stStoreStatus');
    if(!currentUser){
      status.textContent=isEn()?'Sign in first to subscribe.':'سجّل دخولك أولاً للاشتراك.';
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