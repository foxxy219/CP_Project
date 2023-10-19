type IColorMode = {
  toggleColorMode: () => void;
};

interface IItemProps {
  title: string;
  to: string;
  icon: React.ReactNode;
  selected: string;
  setSelected: (string) => void;
}

interface IHeaderProps {
  title: string;
  subtitle: string;
}

interface IChartProps {
  isDashboard?: boolean;
}

interface IFormData {
  firstName: string;
  lastName: string;
  email: string;
  contact: string;
  address1: string;
  address2: string;
}

interface IProgressCircle {
  progress?: number;
  size?: number;
}


interface IStatBox {
  title: string;
  subtitle: string;
  icon: ReactComponentElement;
  progress: number;
  increase: string;
}
