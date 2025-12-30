import 'dotenv/config';
import { server } from './server-config';

const port = process.env.PORT || 3001;

server.listen(port, () : void => {
  console.log(`Listening on port ${port} ...`);
});
