import React from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SecurityIcon from '@mui/icons-material/Security';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import { useNavigate } from 'react-router-dom';

const Section: React.FC<{ title: string; icon?: React.ReactNode; children: React.ReactNode }> = ({
  title,
  icon,
  children,
}) => (
  <Paper className="glass neon-border" elevation={0} sx={{ p: { xs: 2, sm: 2.5 } }}>
    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
      {icon}
      <Typography variant="h6" fontWeight={700}>
        {title}
      </Typography>
    </Stack>
    <Box sx={{ color: 'var(--text)' }}>{children}</Box>
  </Paper>
);

const HelpPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Stack alignItems="center" sx={{ mt: { xs: 2, sm: 4 }, width: '100%' }}>
      <Box sx={{ width: '100%', maxWidth: 1040, px: { xs: 1.5, sm: 2 }, boxSizing: 'border-box' }}>
        <Button
          startIcon={<ArrowBackIcon />}
          variant="text"
          color="secondary"
          onClick={(e) => {
            e.preventDefault();
            navigate(-1);
          }}
          sx={{ mb: { xs: 1, sm: 2 } }}
        >
          Vissza
        </Button>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper className="glass neon-border" elevation={0} sx={{ p: { xs: 2, sm: 2.5 } }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <HelpOutlineIcon color="primary" />
                <Typography variant="h5" fontWeight={700}>
                  Súgó
                </Typography>
              </Stack>
              <Typography className="subtle">
                Itt mindent megtalálsz az új játék indításától a ranglétrán át a profilod
                statisztikáiig. Válaszd ki a téged érdeklő részt, vagy görgess tovább.
              </Typography>
            </Paper>
          </Grid>

          {/* Új játék – AI generálás */}
          <Grid item xs={12}>
            <Section title="Új Játék indítása" icon={<SportsEsportsIcon color="primary" />}>
              <Stack spacing={1.25}>
                <Typography>
                  Az Új Játék képernyőn témát választhatsz, megadhatsz egyedi témát, beállíthatod a
                  nehézséget és a kérdések számát. Az AI generálás bekapcsolásával a rendszer
                  automatikusan létrehozza a kérdéseket.
                </Typography>

                <Stack spacing={0.5}>
                  <Typography sx={{ fontWeight: 700 }}>Mezők és beállítások</Typography>
                  <ul>
                    <li>
                      <strong>Téma választása</strong> – Előre definiált témák (pl. Magyarország
                      történelme, Tudomány, Földrajz, stb.). Az itt választott témák kvízei
                      ranglistára számító pontot adnak.
                    </li>
                    <li>
                      <strong>Egyedi téma</strong> – Írj be bármilyen témát (pl. “Harry Potter
                      varázsigék”). Ebből az AI generál kérdéseket, de az így szerzett pontok
                      informálisak, a ranglistára nem számítanak.
                    </li>
                    <li>
                      <strong>Nehézség</strong> – Könnyű / Közepes / Nehéz. A nehezebb kérdések
                      potenciálisan több pontot érhetnek (ha később pontozási súly kerül bevezetésre).
                    </li>
                    <li>
                      <strong>Kérdések száma</strong> – Csúszkán állítható (pl. 5–20).
                    </li>
                    <li>
                      <strong>AI Generálás</strong> – Ha bekapcsolod, a kérdéseket a rendszer
                      automatikusan állítja össze a kiválasztott vagy megadott témából.
                    </li>
                  </ul>
                </Stack>

                <Stack spacing={0.5}>
                  <Typography sx={{ fontWeight: 700 }}>Pontozás és ranglista</Typography>
                  <ul>
                    <li>
                      <Chip size="small" label="Pontozott" color="primary" sx={{ mr: 1 }} />
                      Csak az előre megadott témákból lejátszott kvízek pontjai számítanak a
                      Ranglétra eredményébe.
                    </li>
                    <li>
                      <Chip size="small" label="Nem rangsorolt" variant="outlined" sx={{ mr: 1 }} />
                      Az egyedi témából AI-val generált kvízek “szórakozás/gyakorlás” célúak.
                    </li>
                  </ul>
                </Stack>

                <Stack spacing={0.5}>
                  <Typography sx={{ fontWeight: 700 }}>Tippek a jó generáláshoz</Typography>
                  <ul>
                    <li>
                      Adj meg elég specifikus témát (pl. “Második világháború magyar vonatkozásai”
                      jobb, mint “háború”).
                    </li>
                    <li>Válassz reális kérdésszámot (5–10), így jobb minőségű kérdések jönnek.</li>
                    <li>Ha valami furcsa, indíts új generálást vagy módosítsd a témát.</li>
                  </ul>
                </Stack>
              </Stack>
            </Section>
          </Grid>

          {/* Ranglétra */}
          <Grid item xs={12}>
            <Section title="Ranglétra" icon={<EmojiEventsIcon color="primary" />}>
              <Stack spacing={1.25}>
                <Typography>
                  A ranglétrán a pontozott (előre megadott témákból játszott) kvízeid eredményei
                  jelennek meg. Kereshetsz név szerint és témát is választhatsz a szűrőben.
                </Typography>
                <ul>
                  <li>
                    <strong>Kiemelt top 3</strong> – Arany, ezüst, bronz jelölés és fényhatás.
                  </li>
                  <li>
                    <strong>Keresés</strong> – Játékosnév alapján leszűkítheted a listát.
                  </li>
                  <li>
                    <strong>Téma szűrő</strong> – Választhatsz témát (pl. Magyarország történelme,
                    Tudomány, stb.). Jelenleg a szűrő UI jellegű; a későbbiekben a lista is szűrhető
                    lesz téma szerint.
                  </li>
                </ul>
              </Stack>
            </Section>
          </Grid>

          {/* Profil */}
          <Grid item xs={12}>
            <Section title="Profil és statisztikák" icon={<AccountCircleIcon color="primary" />}>
              <Stack spacing={1.25}>
                <Typography>
                  A profilodban láthatod a neved, gyors statokat és az eddig játszott kvízeidet.
                </Typography>
                <ul>
                  <li>
                    <strong>Statisztikák</strong> – Összes pont, Összes játék, Átlag pont/játék,
                    Legjobb pont.
                  </li>
                  <li>
                    <strong>Előzmények</strong> – ID, téma, pont listázva. Azonos felület, mint a
                    ranglétrán (beágyazott görgetés, finomított scrollbar).
                  </li>
                  <li>
                    <strong>Achievementek</strong> – Jelvények a nagyobb mérföldkövekért (pl. 10 000
                    pont, 20 000 pont, 40/100 játék). A jelvények színe jelzi, hogy megszerezted-e.
                  </li>
                </ul>
              </Stack>
            </Section>
          </Grid>

          {/* Beállítások */}
          <Grid item xs={12}>
            <Section title="Beállítások" icon={<SettingsIcon color="primary" />}>
              <Stack spacing={1.25}>
                <Typography>
                  Itt választhatsz színsémát és további felhasználói beállításokat. A kiválasztott
                  téma elmentésre kerül a böngészőben (localStorage), így a következő belépéskor is
                  megmarad.
                </Typography>
                <ul>
                  <li>
                    <strong>Színséma</strong> – Purple (alap), Green, Blue, Red, Teal, Amber.
                  </li>
                  <li>
                    <strong>Mentés</strong> – A téma automatikusan mentésre kerül, nincs szükség
                    külön “Mentés” gombra.
                  </li>
                  <li>
                    <strong>Reszponzív előnézet</strong> – Mobilon a témakártyák egy oszlopban
                    jelennek meg, hogy jól láthatók legyenek.
                  </li>
                </ul>
              </Stack>
            </Section>
          </Grid>

          {/* Témák és kategóriák – info */}
          <Grid item xs={12}>
            <Section title="Témák és kategóriák" icon={<FilterAltIcon color="primary" />}>
              <Stack spacing={1.25}>
                <Typography>
                  A témák két nagy csoportra oszthatók: előre megadott és egyedi (AI által generált)
                  témák.
                </Typography>
                <ul>
                  <li>
                    <Chip size="small" label="Előre megadott" color="primary" sx={{ mr: 1 }} />
                    Ide tartoznak pl. Magyarország történelme, Világtörténelem, Tudomány, Földrajz,
                    Irodalom, Sport. Ezek pontozottak, bekerülnek a ranglistába.
                  </li>
                  <li>
                    <Chip size="small" label="Egyedi (AI)" variant="outlined" sx={{ mr: 1 }} />
                    Tetszőleges témát megadhatsz, az AI generál kérdéseket. Ezek pontjai
                    nem ranglistásak, gyakorlásra/party-játékra ideálisak.
                  </li>
                </ul>
              </Stack>
            </Section>
          </Grid>

          {/* Biztonság és adatkezelés – rövid tájékoztató */}
          <Grid item xs={12}>
            <Section title="Biztonság és adatkezelés" icon={<SecurityIcon color="primary" />}>
              <Stack spacing={1.25}>
                <Typography>
                  A beállítások (pl. színséma) a böngésződben tárolódnak. Bejelentkezés után a
                  játékadataid a fiókodhoz kapcsolódnak. Egyedi témákhoz megadott rövid promptok csak
                  a kérdésgeneráláshoz kerülnek felhasználásra.
                </Typography>
              </Stack>
            </Section>
          </Grid>

          {/* GYIK – összecsukható */}
          <Grid item xs={12}>
            <Paper className="glass neon-border" elevation={0} sx={{ p: { xs: 2, sm: 2.5 } }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <TipsAndUpdatesIcon color="primary" />
                <Typography variant="h6" fontWeight={700}>
                  Gyakran Ismételt Kérdések
                </Typography>
              </Stack>

              <Accordion disableGutters>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Miért nem számít az egyedi (AI) téma pontja a ranglistába?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography className="subtle">
                    Az egyedi témák minősége és nehézsége eltérő lehet, így a ranglistás
                    összehasonlítás nem lenne fair. Az előre megadott témák egységesebbek, ezért
                    ezek az eredmények bekerülnek a ranglistába.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion disableGutters>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Mit tehetek, ha az AI furcsa kérdést generált?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography className="subtle">
                    Indíts új generálást pontosabb témamegadás mellett, vagy válts előre megadott
                    témára. Általában a specifikusabb téma jobb eredményt ad.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion disableGutters>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Hogyan tudok témát váltani a ranglétrán?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography className="subtle">
                    A Ranglétra tetején lévő Téma szűrő (legördülő) segítségével választhatsz
                    kategóriát. Jelenleg a szűrő UI jellegű, a lista alapértelmezett nézetet mutat.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion disableGutters>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Hol találom a saját játékaimat és pontjaimat?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography className="subtle">
                    A Profil oldalon a neved alatt látható a statisztika összesítve, lejjebb pedig
                    listázva az eddigi játékaid ID-vel, témával és pontszámmal.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Paper>
          </Grid>

          {/* Gyors tippek “kártya” */}
          <Grid item xs={12}>
            <Section title="Gyors tippek" icon={<AutoAwesomeIcon color="primary" />}>
              <ul>
                <li>Ha mobilon használsz listát, oldalirányú görgetés NINCS – a lista függőlegesen görgethető.</li>
                <li>Ha túl hosszú a lista, a kártyán belül külön scrollbar jelenik meg.</li>
                <li>Színséma váltás után nincs szükség mentésre – automatikusan elmentjük.</li>
                <li>Vissza gombbal mindig az előző képernyőre jutsz, újratöltés nélkül.</li>
              </ul>
            </Section>
          </Grid>
        </Grid>

        <Box sx={{ height: 16 }} />
      </Box>
    </Stack>
  );
};

export default HelpPage;