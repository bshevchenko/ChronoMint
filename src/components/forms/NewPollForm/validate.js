import * as validate from '../validate'

export default (values) => {
  const errors = {}
  const jsValues = values.toJS()

  errors.pollTitle = validate.name(jsValues.pollTitle)

  // errors.pollDescription = validate.name(jsValues.pollDescription);

/// //////////////// options
  let filledOptionsCount = 0
  if (jsValues.options) {
    const optionsArrayErrors = []

    jsValues.options.forEach((option, optionIndex) => {
      if (option && option.length) {
        filledOptionsCount++
        if (option.length < 3) {
          optionsArrayErrors[optionIndex] = 'Should have length more than or equal 3 symbols'
        }
      }
    })
    if (optionsArrayErrors.length) {
      errors.options = optionsArrayErrors
    }
  }

  if (!jsValues.options || jsValues.options.length < 2 || filledOptionsCount < 2) {
    errors.options = {_error: 'At least two options must be filled'}
  }

  if (filledOptionsCount > 16) {
    errors.options = {_error: 'Allowed no more then 16 filled options'}
  }

/// //////////////// files
  let filledFilesCount = jsValues.files && jsValues.files.filter((hash) => hash && hash.length).length

  if (filledFilesCount > 5) {
    errors.files = {_error: 'Allowed no more then 5 files'}
  }

  return errors
}
