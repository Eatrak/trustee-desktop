import { useLocation, useNavigate } from "react-router-dom";
import { IconProps } from "@radix-ui/react-icons/dist/types";

import { Button } from "@/components/ui/button";

interface IProps {
    text: string;
    Icon: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<SVGSVGElement>>;
    path: string;
    isActive?: boolean;
}

const NavbarButton = ({ text, Icon, path }: IProps) => {
    const location = useLocation();
    const navigate = useNavigate();

    const open = () => {
        navigate(path);
    };

    return (
        <Button
            variant={location.pathname === path ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={open}
        >
            <Icon className="mr-2 h-4 w-4" />
            {text}
        </Button>
    );
};

export default NavbarButton;
