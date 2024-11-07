const channels = document.querySelectorAll('.channel-card');
const playerContainer = document.getElementById('video-player');
const player = document.getElementById('player');
let currentIndex = 0;

// Função para atualizar o foco no card ativo
const updateFocus = () => {
  channels.forEach((channel, index) => {
    channel.classList.toggle('active', index === currentIndex);
  });
  channels[currentIndex].focus();
};

// Função para reproduzir o canal selecionado
const playChannel = () => {
  const channelUrl = channels[currentIndex].getAttribute('data-url');

  if (Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(channelUrl);
    hls.attachMedia(player);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      player.play();
    });
  } else if (player.canPlayType('application/vnd.apple.mpegurl')) {
    player.src = channelUrl;
    player.addEventListener('loadedmetadata', () => {
      player.play();
    });
  } else {
    alert("Seu dispositivo não suporta reprodução HLS.");
  }
  playerContainer.style.display = 'flex';
};

// Função para navegar pelos canais
const navigateChannels = (direction) => {
  currentIndex = (currentIndex + direction + channels.length) % channels.length;
  updateFocus();
  playChannel();
};

// Função para fechar o player de vídeo
const closePlayer = () => {
  playerContainer.style.display = 'none';
  player.pause();
};

// Inicialização
updateFocus();
playChannel();

// Evento para navegar pelos canais
document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowUp':
      navigateChannels(1);
      break;
    case 'ArrowDown':
      navigateChannels(-1);
      break;
    case 'ArrowRight':
      currentIndex = (currentIndex + 1) % channels.length;
      updateFocus();
      break;
    case 'ArrowLeft':
      currentIndex = (currentIndex - 1 + channels.length) % channels.length;
      updateFocus();
      break;
    case 'Enter':
      playChannel();
      break;
    case 'GoBack':
    case 'Escape':
      if (playerContainer.style.display === 'flex') {
        closePlayer();
      } else {
        webOS.platformBack();
      }
      break;
    default:
      break;
  }
});

// Fechar o player de vídeo ao sair do modo de tela cheia
player.addEventListener('ended', closePlayer);