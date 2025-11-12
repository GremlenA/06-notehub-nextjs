
type Props = {
  children: React.ReactNode;
  sideBar: React.ReactNode;
};

const NotesLayout = ({ children, sideBar }: Props) => {
  return (
    <section>
      <aside>{sideBar}</aside>
      <div>{children}</div>
    </section>
  );
};

export default NotesLayout;
