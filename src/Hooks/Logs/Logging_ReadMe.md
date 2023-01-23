# Logging ReadMe

This is a fairly simple situation but I am placing the use case for logging Hooks vs regular logs here for reference and consistency. Ultimately this should end up in doc's or in the projects ReadMe when those are able to be generated and well documented.

Please keep in mind: The Hooks defined here do nothing more than call a logging function... they should offer no functionality! Ergo, a Logging hook should be able to be replaced with a console.log function all with ease; these hooks are only implemented to keep with the "DRY" mentality "Don't Repeat Yourself" which is just good code practices...

## Logging Hooks

Logging Hooks found in this folder should be used for DRY Purposes ONLY. You do not need to create a new Logging Hook for every log you wish to create... If you need to log data that is a one off scenario, see the log function below...

Logging Hooks ideally should be written when a log event is going to occur in multiple locations throughout the app. A Prime Example of this is when a user uses Pull to Refresh in order and we wish to log all those interactions. Rather than writing a 10 line log many times in the app, this scenario is more beneficial with a callable Hook with minimal parameters for consistency and brevity/code-condensing.

Example:

```javascript
H.log.useLog_PullToRefresh('1234', 'Internal Feed');
```

# DEPRECATED

## Logging Function

Console.Log() has been overridden in the useLogging hook that is initialized at the app mounting phases. This should be used when there is a one-off logging event that needs to happen. This project includes a few code snippets that are included in the git repository; that should assist with the creation of these logs... simply type "log" and select the auto complete option for this project... I will paste a current (at the time of writing) log below for demonstration. Comments can be removed once you are done creating the log.

```javascript
console.log({
  title: ``,
  message: ``,
  // Insert Your own Key Value pairs for custom logging points
  tags: [''],
  id: `1613420891`,
  iLog: true,
  analytics: {
    // Insert Your own Key Value pairs for custom logging points
    name: ``,
    // Insert Your own Key Value pairs for custom logging points
    strip: [''],
  },
  // Insert Your own Key Value pairs for custom logging points
});
```
