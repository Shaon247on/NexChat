import ScrollNavbar from "./ScrollNavbar";

// Server Component wrapper — passes no props, lets ScrollNavbar (Client) handle everything
export default function Navbar() {
  return <ScrollNavbar />;
}
