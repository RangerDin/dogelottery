type Props = {
  className?: string;
};

const ConnectButton = ({ className }: Props): JSX.Element => {
  return <button className={className}>Connect</button>;
};

export default ConnectButton;
