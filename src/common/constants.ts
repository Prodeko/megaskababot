import { Guild, Sport, Validation } from "./types"

export const INTRODUCTORY_MESSAGE = "Welcome to Megaskaba! I help you record entries from your sports tracker app to the competition. \
Firstly, you need to accept this privacy policy to continue."

export const PRIVACY_POLICY = "Megaskababot stores your name, Telegram user ID and username, \
guild and the year you started your studies in, in a database that is maintained by Prodeko. \
Additionally, for every entry that you make, its timestamp, the distance travelled, and the sport are saved to the same database. \
Images that you send are handled by Telegram. \
\
The developers of Megaskababot and the competition's administrators have access to all the data that you have sent, \
and will perform spot checks to verify the integrity of the competition."

export const START_REGISTRATION_MESSAGE = "You have not registered previously, so I'll ask you a few questions first."

export const PRIVACY_REJECTED_MESSAGE = "Sorry, you need to accept the privacy policy to continue. Restart the chat with /start."

export const GUILDS: Guild[] = ['prodeko', 'athene', 'fyysikkokilta', 'tietokilta']
export const YEARS = ["13", "14", "15", "16", "17", "18", "19", "20", "21", "22"].reverse()
export const SPORTS: Sport[] = ["run/walk", "ski"]
export const VALIDATIONS: Validation[] = ['Valid', 'Invalid', 'Stop validation']