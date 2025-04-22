import PropTypes from 'prop-types'

const FilterCheckBox = ({
    id,
    name,
    value,
    currentValue,
    onChange,
    type = "radio",
}) => {
    return (
        <div className="flex items-center">
            <input
                id={id}
                name={type === "radio" ? name : id}
                type={type}
                checked={value === currentValue}
                onChange={() => onChange(value)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor={id} className="ml-3 text-sm text-gray-600">
                {name === "all" ? "Tất cả" : name}
            </label>
        </div>
    )
}

FilterCheckBox.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    currentValue: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    type: PropTypes.oneOf(['radio', 'checkbox']),
}

FilterCheckBox.defaultProps = {
    type: 'radio',
}

export default FilterCheckBox