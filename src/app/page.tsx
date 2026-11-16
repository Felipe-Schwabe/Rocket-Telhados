'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { projects, site } from '@/config/site';

const categories = ['Todos', 'Coberturas metálicas', 'Telhas onduladas'];
const questions = [
  ['Como posso solicitar um orçamento?', 'Use o formulário desta página ou fale diretamente com a Rocket pelo WhatsApp. A mensagem abre no seu aplicativo para você revisar e enviar.'],
  ['Quais serviços a Rocket realiza?', 'A comunicação atual da empresa destaca trocas e reformas de telhados. O escopo de cada serviço pode ser conversado diretamente com a equipe.'],
  ['Vocês atendem Joinville?', 'A Rocket divulga atendimento em Joinville e região.'],
  ['Posso enviar fotos do telhado?', 'Você pode anexar fotos ao conversar com a equipe pelo canal oficial. Esta proposta não recebe nem armazena arquivos.'],
];

function Arrow({ diagonal = false }: { diagonal?: boolean }) { return <span aria-hidden="true" className="arrow">{diagonal ? '↗' : '→'}</span>; }
function WhatsAppIcon() { return <svg className="whatsapp-icon" aria-hidden="true" viewBox="0 0 32 32"><path d="M16.04 3a12.75 12.75 0 0 0-10.9 19.38L3.5 29l6.8-1.78A12.9 12.9 0 1 0 16.04 3Zm0 23.4c-1.98 0-3.92-.53-5.62-1.54l-.4-.24-4.04 1.06 1.08-3.94-.26-.41a10.6 10.6 0 1 1 9.24 5.07Zm5.82-7.94c-.32-.16-1.9-.94-2.2-1.05-.3-.11-.5-.16-.72.16-.21.32-.82 1.05-1 1.27-.18.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.58-.95-.84-1.6-1.88-1.78-2.2-.19-.31-.02-.48.14-.64.14-.14.32-.37.48-.56.16-.18.21-.32.32-.53.1-.22.05-.4-.03-.56-.08-.16-.72-1.74-.99-2.38-.26-.63-.53-.54-.72-.55h-.61c-.21 0-.56.08-.85.4-.29.31-1.11 1.08-1.11 2.64 0 1.55 1.14 3.05 1.3 3.26.16.22 2.24 3.42 5.42 4.79.76.33 1.35.52 1.81.67.76.24 1.45.21 2 .13.61-.09 1.9-.78 2.16-1.53.27-.76.27-1.41.19-1.54-.08-.14-.29-.22-.61-.38Z"/></svg>; }
const whatsappUrl = (message: string) => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [category, setCategory] = useState('Todos');
  const [activeImage, setActiveImage] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [service, setService] = useState('Troca de telhado');
  const [property, setProperty] = useState('Residencial');
  const [problem, setProblem] = useState('Goteiras ou infiltração');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [area, setArea] = useState('');
  const [details, setDetails] = useState('');
  const [whatsappFallback, setWhatsappFallback] = useState('');
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const filtered = useMemo(() => projects.map((p, i) => ({ ...p, i })).filter((p) => category === 'Todos' || p.category === category), [category]);
  const quoteText = `Olá, Rocket Telhados! Gostaria de solicitar um orçamento.\nNome: ${name}\nServiço: ${service}\nImóvel: ${property}\nCidade e bairro: ${location}\nNecessidade: ${problem}${area ? `\nÁrea aproximada: ${area}` : ''}${details ? `\nDetalhes: ${details}` : ''}`;

  useEffect(() => {
    if (activeImage === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') { setActiveImage(null); window.requestAnimationFrame(() => returnFocusRef.current?.focus()); }
      if (event.key === 'ArrowRight') setActiveImage((current) => current === null ? null : (current + 1) % projects.length);
      if (event.key === 'ArrowLeft') setActiveImage((current) => current === null ? null : (current + projects.length - 1) % projects.length);
      if (event.key === 'Tab') {
        const items = document.querySelectorAll<HTMLElement>('.lightbox button');
        const first = items[0]; const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => { window.removeEventListener('keydown', onKeyDown); document.body.style.overflow = previousOverflow; };
  }, [activeImage]);

  useEffect(() => {
    if (!menuOpen) return;
    function closeOnEscape(event: KeyboardEvent) { if (event.key === 'Escape') setMenuOpen(false); }
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  useEffect(() => {
    const sectionIds = ['servicos', 'obras', 'sobre', 'processo', 'contato'];
    const sections = sectionIds.map((id) => document.getElementById(id)).filter((section): section is HTMLElement => Boolean(section));
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveSection(visible.target.id);
    }, { rootMargin: '-20% 0px -65% 0px', threshold: [0, 0.1, 0.5, 1] });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  function closeMenu() { setMenuOpen(false); }
  function closeLightbox(event: React.MouseEvent<HTMLDivElement>) { if (event.target === event.currentTarget) dismissLightbox(); }
  function dismissLightbox() { setActiveImage(null); window.requestAnimationFrame(() => returnFocusRef.current?.focus()); }

  return <>
    <header className="header">
      <a className="brand" href="#inicio" aria-label="Rocket Telhados — início"><Image src="/images/brand/rocket-telhados.jpg" alt="Rocket Telhados" width={1414} height={2000} /></a>
      <button className={menuOpen ? 'menu-toggle menu-toggle-open' : 'menu-toggle'} aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'} aria-controls="main-navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><span/><span/></button>
      {menuOpen && <button className="nav-scrim" type="button" aria-label="Fechar menu" onClick={closeMenu}/>}
      <nav id="main-navigation" className={menuOpen ? 'nav nav-open' : 'nav'} aria-label="Navegação principal">
        <a className={activeSection === 'servicos' ? 'nav-link nav-link-active' : 'nav-link'} aria-current={activeSection === 'servicos' ? 'location' : undefined} href="#servicos" onClick={closeMenu}>Serviços</a><a className={activeSection === 'obras' ? 'nav-link nav-link-active' : 'nav-link'} aria-current={activeSection === 'obras' ? 'location' : undefined} href="#obras" onClick={closeMenu}>Obras</a><a className={activeSection === 'sobre' ? 'nav-link nav-link-active' : 'nav-link'} aria-current={activeSection === 'sobre' ? 'location' : undefined} href="#sobre" onClick={closeMenu}>Sobre</a><a className={activeSection === 'processo' ? 'nav-link nav-link-active' : 'nav-link'} aria-current={activeSection === 'processo' ? 'location' : undefined} href="#processo" onClick={closeMenu}>Como funciona</a><a className={activeSection === 'contato' ? 'nav-link nav-link-active' : 'nav-link'} aria-current={activeSection === 'contato' ? 'location' : undefined} href="#contato" onClick={closeMenu}>Contato</a>
      </nav>
    </header>

    <main>
      <section className="hero" id="inicio">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-line"/> ESPECIALISTAS EM TELHADOS <span className="eyebrow-place">· JOINVILLE, SC</span></div>
          <h1>Seu telhado<br/>protegido.<br/><em>Seu patrimônio</em><br/>valorizado.</h1>
          <p>Trocas e reformas de telhados com atenção a cada detalhe da cobertura.</p>
          <div className="hero-actions"><a className="button button-orange" href={whatsappUrl('Olá, Rocket Telhados! Gostaria de solicitar um orçamento.')} target="_blank" rel="noreferrer"><WhatsAppIcon/> Pedir orçamento no WhatsApp <Arrow diagonal /></a><a className="text-link light-link" href="#servicos">Conhecer serviços <Arrow /></a></div>
          <div className="hero-foot"><span>UMA HISTÓRIA QUE COMEÇOU EM 2015</span><span>SC <b>·</b> 26°18′ S</span></div>
        </div>
        <div className="hero-visual"><Image src="/images/obras/troca-cobertura.jpeg" alt="Vista aérea de uma cobertura metálica clara" fill sizes="(max-width: 680px) 100vw, 53vw" priority/><div className="image-shade"/><div className="photo-note"><span>ACERVO DA ROCKET TELHADOS</span><span>COBERTURA METÁLICA <b>↗</b></span></div><div className="hero-index">01 <i/> 05</div></div>
      </section>

      <div className="proof-strip"><span>EXPERIÊNCIA FAMILIAR NO SEGMENTO</span><i/><span>TRAJETÓRIA DESDE 2015</span><i/><span>JOINVILLE E REGIÃO</span><i/><span>TROCAS E REFORMAS</span></div>

      <section className="intro section-wrap" id="sobre">
        <div className="section-kicker"><span>01 / QUEM SOMOS</span><span>RAÍZES NA CONSTRUÇÃO</span></div>
        <div className="intro-grid"><h2>Uma história<br/>que começa <em>no telhado.</em></h2><div className="intro-body"><p>A Rocket Telhados nasceu da experiência de uma família que já trabalhava com instalação de telhados e do desejo de empreender. Em 2015, essa história ganhou um nome próprio.</p><p>Hoje, a empresa apresenta seu trabalho em Joinville e região, com foco em trocas e reformas de telhados.</p><a className="text-link" href="#processo">Conheça nosso jeito de trabalhar <Arrow /></a></div></div>
      </section>

      <section className="services section-wrap" id="servicos">
        <div className="section-kicker"><span>02 / ESPECIALIDADES</span><span>O QUE FAZEMOS</span></div>
        <div className="services-head"><h2>Soluções para<br/><em>cada cobertura.</em></h2><p>Do telhado que pede uma nova etapa ao cuidado de uma reforma. Cada imóvel tem uma necessidade — a conversa começa por ela.</p></div>
        <div className="service-list">
          <a href="#orcamento" className="service-row"><span className="service-no">01</span><span className="service-title">Trocas de telhado</span><span className="service-desc">Uma nova cobertura, planejada para o seu imóvel.</span><span className="service-arrow"><Arrow diagonal /></span></a>
          <a href="#orcamento" className="service-row"><span className="service-no">02</span><span className="service-title">Reformas de telhado</span><span className="service-desc">Recuperação de coberturas existentes, conforme a necessidade.</span><span className="service-arrow"><Arrow diagonal /></span></a>
        </div>
      </section>

      <section className="gallery-section" id="obras">
        <div className="gallery-inner"><div className="section-kicker light-kicker"><span>03 / ACERVO</span><span>TRABALHOS APRESENTADOS PELA ROCKET</span></div><div className="gallery-heading"><h2>O trabalho<br/>fala <em>por si.</em></h2><p>Imagens do acervo público da Rocket Telhados. Cada cobertura tem sua própria história.</p></div>
          <div className="filters" role="group" aria-label="Filtrar imagens por categoria">{categories.map((c) => <button key={c} className={category === c ? 'filter active' : 'filter'} onClick={() => setCategory(c)}>{c}<span>{c === 'Todos' ? String(projects.length).padStart(2, '0') : String(projects.filter((p) => p.category === c).length).padStart(2, '0')}</span></button>)}</div>
          <div className="gallery-grid">{filtered.map((image) => <button className={`gallery-card ${image.fit}`} key={image.src} onClick={(event) => { returnFocusRef.current = event.currentTarget; setActiveImage(image.i); }} aria-label={`Ampliar imagem: ${image.alt}`}><Image src={image.src} alt={image.alt} fill sizes="(max-width: 680px) 50vw, 30vw" loading="lazy"/><span className="gallery-overlay"><span>{image.category}</span><b>↗</b></span></button>)}</div>
          <div className="gallery-bottom"><span>ACERVO ORIGINAL · 05 IMAGENS</span><span>TOQUE EM UMA FOTO PARA AMPLIAR</span></div>
        </div>
      </section>

      <section className="process section-wrap" id="processo"><div className="section-kicker"><span>04 / COMO FUNCIONA</span><span>UMA CONVERSA DIRETA</span></div><div className="process-head"><h2>Do primeiro contato<br/>ao <em>próximo passo.</em></h2><p>Um caminho simples para entender o que sua cobertura precisa.</p></div><div className="steps"><article><span>01</span><h3>Conte sobre o imóvel</h3><p>Explique se busca uma troca ou uma reforma e onde fica o imóvel.</p></article><article><span>02</span><h3>Compartilhe referências</h3><p>Fotos podem ajudar a iniciar a conversa sobre a cobertura.</p></article><article><span>03</span><h3>Converse com a equipe</h3><p>A Rocket pode entender melhor a necessidade e orientar os próximos passos.</p></article></div></section>

      <section className="quote-section" id="orcamento"><div className="quote-photo"><Image src="/images/obras/cobertura-metalica-ampla.jpeg" alt="Vista de uma cobertura metálica ampla" fill sizes="(max-width: 680px) 100vw, 44vw" loading="lazy"/><div className="quote-photo-label">ROCKET TELHADOS <span>·</span> JOINVILLE</div></div><div className="quote-form-area"><div className="section-kicker light-kicker"><span>05 / ORÇAMENTO</span><span>FALE COM A EQUIPE</span></div><h2>Vamos conversar<br/>sobre seu <em>telhado?</em></h2><p className="quote-intro">Conte um pouco sobre o que você precisa. Sua mensagem será aberta no WhatsApp para você revisar e enviar.</p>
          <form onSubmit={(e) => { e.preventDefault(); const url = whatsappUrl(quoteText); setWhatsappFallback(url); window.open(url, '_blank', 'noopener,noreferrer'); }}><label>Seu nome<input autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Como podemos chamar você?"/></label><label>O que você procura?<select value={service} onChange={(e) => setService(e.target.value)}><option>Troca de telhado</option><option>Reforma de telhado</option><option>Quero entender a necessidade</option></select></label><label>Tipo de imóvel<select value={property} onChange={(e) => setProperty(e.target.value)}><option>Residencial</option><option>Comercial</option><option>Industrial</option><option>Condomínio</option><option>Outro</option></select></label><label>Cidade e bairro<input autoComplete="address-level2" required value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Ex.: Joinville, América"/></label><label>O que precisa de atenção?<select value={problem} onChange={(e) => setProblem(e.target.value)}><option>Goteiras ou infiltração</option><option>Telhas quebradas</option><option>Telhado antigo</option><option>Necessidade de reforma</option><option>Nova cobertura</option><option>Outra necessidade</option></select></label><label>Área aproximada <span className="optional">opcional</span><input value={area} onChange={(e) => setArea(e.target.value)} placeholder="Ex.: 120 m²"/></label><label>Conte mais <span className="optional">opcional</span><textarea value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Outros detalhes que ajudem a entender o serviço..." rows={3}/></label><button className="button button-orange form-button" type="submit"><WhatsAppIcon/> Continuar no WhatsApp <Arrow diagonal /></button></form>
          <p className="data-note">Os dados preenchidos são incluídos na mensagem do WhatsApp. Este site não armazena as informações do formulário.</p>
          {whatsappFallback && <p className="whatsapp-fallback" aria-live="polite">Se o WhatsApp não abriu, <a href={whatsappFallback} target="_blank" rel="noreferrer">toque aqui para continuar a conversa ↗</a></p>}
        </div></section>

      <section className="faq section-wrap"><div className="section-kicker"><span>06 / DÚVIDAS</span><span>RESPOSTAS DIRETAS</span></div><div className="faq-grid"><h2>Antes de<br/><em>começar.</em></h2><div className="faq-list">{questions.map(([question, answer], i) => <div className="faq-item" key={question}><button aria-expanded={openFaq === i} onClick={() => setOpenFaq(openFaq === i ? null : i)}><span>{question}</span><b>{openFaq === i ? '−' : '+'}</b></button>{openFaq === i && <p>{answer}</p>}</div>)}</div></div></section>

      <section className="closing"><div><span>ROCKET TELHADOS · JOINVILLE, SC</span><h2>Seu imóvel merece<br/>uma cobertura <em>bem cuidada.</em></h2><a href={whatsappUrl('Olá, Rocket Telhados! Gostaria de conversar sobre meu telhado.')} target="_blank" rel="noreferrer" className="button button-orange"><WhatsAppIcon/> Falar pelo WhatsApp <Arrow diagonal /></a></div><div className="closing-mark">R<span>.</span></div></section>
    </main>
    <footer id="contato"><div className="footer-top"><a className="brand footer-brand" href="#inicio"><Image src="/images/brand/rocket-telhados.jpg" alt="Rocket Telhados" width={1414} height={2000}/></a><p>Trocas e reformas de telhados<br/>em Joinville e região.</p><div className="footer-contacts"><a href={whatsappUrl('Olá, Rocket Telhados! Gostaria de solicitar um orçamento.')} target="_blank" rel="noreferrer"><WhatsAppIcon/> WhatsApp · {site.phone} <Arrow diagonal /></a><a href={`tel:${site.phoneLink}`}>{site.phone} <Arrow diagonal /></a><a href={`mailto:${site.email}`}>{site.email} <Arrow diagonal /></a><a href={site.instagram} target="_blank" rel="noreferrer">@rocket_telhados <Arrow diagonal /></a></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} ROCKET TELHADOS · JOINVILLE, SC</span><span>JOINVILLE, SC · TROCAS E REFORMAS</span><a href="#inicio">VOLTAR AO TOPO ↑</a></div></footer>


    {activeImage !== null && <div className="lightbox" role="dialog" aria-modal="true" aria-label="Visualização da imagem" onClick={closeLightbox}><button className="lightbox-close" autoFocus onClick={dismissLightbox} aria-label="Fechar imagem">×</button><button className="lightbox-prev" aria-label="Imagem anterior" onClick={() => setActiveImage((activeImage + projects.length - 1) % projects.length)}>←</button><figure><Image src={projects[activeImage].src} alt={projects[activeImage].alt} width={projects[activeImage].width} height={projects[activeImage].height}/><figcaption>{projects[activeImage].category} <span>· {String(activeImage + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</span></figcaption></figure><button className="lightbox-next" aria-label="Próxima imagem" onClick={() => setActiveImage((activeImage + 1) % projects.length)}>→</button></div>}
  </>;
}
