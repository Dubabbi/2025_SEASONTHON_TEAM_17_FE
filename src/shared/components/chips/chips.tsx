interface ChipProps {
  name: string;
}

const chips = ({ name }: ChipProps) => {
  return (
    <div className="rounded-[999px] border border-primary-400 px-[1.6rem] py-[0.7rem]">
      <p className="detail text-primary-400">{name}</p>
    </div>
  );
};

export default chips;
