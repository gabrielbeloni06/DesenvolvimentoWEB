document.addEventListener("DOMContentLoaded", function() {
  const urlParams = new URLSearchParams(window.location.search);
  const filmeId = urlParams.get('id');

  const filmes = [
    {
      id: 1,
      titulo: "Minecraft: O Filme",
      descricao: "Um jovem corajoso e seus amigos embarcam em uma jornada épica pelo mundo de blocos do Minecraft para salvar seu lar da destruição. Em um universo cheio de perigos, eles precisarão trabalhar juntos, explorar, construir e sobreviver para derrotar a temida vilã.",
      imagem: "img/minecraft.jpg",
      trailer: "https://www.youtube.com/embed/EVKYAAES6JQ",
      genero: "Aventura / Fantasia",
      duracao: "1h 45min",
      classificacao: "Livre"
    },
    {
      id: 2,
      titulo: "A Presença",
      descricao: "Em uma casa isolada, uma presença misteriosa começa a atormentar uma jovem e sua família. À medida que eventos sobrenaturais se intensificam, ela precisa descobrir os segredos do passado escondidos nas paredes daquela casa antes que seja tarde demais.",
      imagem: "img/a-presenca.jpg",
      trailer: "https://www.youtube.com/embed/QbXOCYU1dQc",
      genero: "Terror / Suspense",
      duracao: "1h 30min",
      classificacao: "14 anos"
    },
    {
      id: 3,
      titulo: "Five Nights at Freddy's",
      descricao: "Um segurança recém-contratado em uma pizzaria aparentemente comum logo descobre que seus turnos noturnos serão tudo, menos tranquilos. Criaturas animatrônicas ganham vida após o expediente, revelando segredos macabros em uma luta por sobrevivência a cada madrugada.",
      imagem: "img/outro.jpg",
      trailer: "https://www.youtube.com/embed/akJMKqpfUww",
      genero: "Terror",
      duracao: "1h 50min",
      classificacao: "16 anos"
    },
    {
      id: 4,
      titulo: "Avatar 2",
      descricao: "Após anos vivendo em Pandora, Jake Sully e Neytiri enfrentam novos desafios com o surgimento de ameaças externas e conflitos internos. Em meio a cenários deslumbrantes e culturas fascinantes, a luta pela sobrevivência e pela harmonia do planeta continua.",
      imagem: "img/avatar2.jpg",
      trailer: "https://www.youtube.com/embed/x5pZI-DmtrE",
      genero: "Ficção / Aventura",
      duracao: "3h 12min",
      classificacao: "12 anos"
    },
    {
      id: 5,
      titulo: "Interestelar",
      descricao: "Com a Terra à beira do colapso, um grupo de astronautas parte em uma missão intergaláctica em busca de um novo lar para a humanidade. Enfrentando buracos negros, dilatação do tempo e o peso das escolhas, eles desafiam os limites da ciência e do amor.",
      imagem: "img/interestelar.jpg",
      trailer: "https://www.youtube.com/embed/i6avfCqKcQo",
      genero: "Ficção Científica / Drama",
      duracao: "2h 49min",
      classificacao: "10 anos"
    }
  ];

  const filme = filmes.find(f => f.id === parseInt(filmeId));

  if (filme) {
    document.getElementById("imagemFilme").src = filme.imagem;
    document.getElementById("tituloFilme").textContent = filme.titulo;
    document.getElementById("descricaoFilme").textContent = filme.descricao;

    document.getElementById("generoFilme").querySelector('span').textContent = filme.genero;
    document.getElementById("duracaoFilme").querySelector('span').textContent = filme.duracao;
    document.getElementById("classificacaoFilme").querySelector('span').textContent = filme.classificacao;
    
    const iframe = document.createElement('iframe');
    iframe.width = "100%";
    iframe.height = "400";
    iframe.src = filme.trailer;
    iframe.frameBorder = "0";
    iframe.allowFullscreen = true;
    document.getElementById("filme-individual").appendChild(iframe);
  } else {
    document.getElementById("tituloFilme").textContent = "Filme não encontrado";
    document.getElementById("descricaoFilme").textContent = "Desculpe, não conseguimos encontrar os detalhes desse filme.";
  }

  document.getElementById("btnCurtir").addEventListener("click", () => {
    alert("Você curtiu o filme!");
  });

  document.getElementById("btnNaoCurtir").addEventListener("click", () => {
    alert("Você não curtiu o filme.");
  });
});