type WrapperProps = {
  children: React.ReactNode;
};

export default function Wrapper({ children }: WrapperProps) {
  return (
    <>
      <div className="my-10 px-5 md:px-[10%]">{children}</div>
    </>
  );
}
