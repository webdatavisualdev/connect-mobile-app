enum tags {
  // The user did something
  userInteraction = 'interaction_userInteraction',
  gesture = 'interaction_gesture',
  press = 'interaction_press',
  longPress = 'interaction_longPress',
  userTriggerEvent = 'interaction_analyticsEvent',

  // Resulting Actions
  navigate = 'action_navigate',

  // Event source type
  button = 'source_button',
  text = 'source_text',
  image = 'source_image',

  // Networking Related Tags
  network = 'net_network',
  fetch = 'net_fetch',

  // Problems or Errors
  error = 'error_error',
  warning = 'error_warning',

  // Misc Tags (Could have meaning in multiple categories)
  refresh = 'misc_refresh',
  analyticsEvent = 'misc_analyticsEvent',
}

export default tags;
