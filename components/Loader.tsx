type props = {
  show: Boolean;
};

export default function Loader({ show }: props) {
  return show ? <div className="loader"></div> : null;
}
