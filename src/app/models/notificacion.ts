interface NotificacionInterface {
  app_id: string;
  data: Data;
  contents: Contents;
  headings: Contents;
  include_player_ids: string[];
  android_channel_id: string;
}

interface Contents {
  en: string;
  es: string;
}

interface Data {
  nombre: string;
  apellido: string;
  direccion: string;
}