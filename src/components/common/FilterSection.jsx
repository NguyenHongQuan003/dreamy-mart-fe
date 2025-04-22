import { FaChevronDown } from 'react-icons/fa'
import propTypes from 'prop-types'

const FilterSection = ({
    title,
    children,
    isOpen = true,
    toggleOpen = null,
}) => {
    return (
        <div className="border-b border-gray-200 py-4">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-md font-medium text-gray-900">{title}</h3>
                {toggleOpen && (
                    <button onClick={toggleOpen} className="text-gray-500">
                        <FaChevronDown
                            className={`h-4 w-4 ${isOpen ? "transform rotate-180" : ""}`}
                        />
                    </button>
                )}
            </div>
            <div className={`${isOpen ? "block" : "hidden"} space-y-2`}>
                {children}
            </div>
        </div>
    )
}

FilterSection.propTypes = {
    title: propTypes.string.isRequired,
    children: propTypes.node,
    isOpen: propTypes.bool,
    toggleOpen: propTypes.func,
}

export default FilterSection