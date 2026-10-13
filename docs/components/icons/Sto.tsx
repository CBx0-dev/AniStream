import Image, {ImageProps} from "next/image";

import sto from "./sto.svg";

export function Sto({className = 'inline-block w-full align-sub object-contain', ...props}: Partial<ImageProps>) {
    return (
        <Image
            src={sto}
            alt="S.TO"
            className={className}
            {...props}
        />
    );
}
