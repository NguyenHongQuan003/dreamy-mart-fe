import { Resizable } from "react-resizable";
import "react-resizable/css/styles.css";
import PropTypes from "prop-types";

const ResizableTitle = (props) => {
    const { onResize, width, ...restProps } = props;

    if (!width) {
        return <th {...restProps} />;
    }

    return (
        <Resizable
            width={width}
            height={0}
            handle={
                <span
                    className="react-resizable-handle"
                    onClick={(e) => e.stopPropagation()}
                />
            }
            onResize={onResize}
            draggableOpts={{ enableUserSelectHack: false }}
        >
            <th {...restProps} />
        </Resizable>
    );
};

ResizableTitle.propTypes = {
    onResize: PropTypes.func,
    width: PropTypes.number,
};

export default ResizableTitle;
