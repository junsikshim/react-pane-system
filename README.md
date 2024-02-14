# react-pane-system

A declarative, flexible pane layout system for React projects.

[View the Storybook](https://junsikshim.github.io/react-pane-system)

## Example

```jsx
<PaneSystem width="100vw" height="100vh">
  <PaneRow>
    <Pane
      id="left-pane"
      width="30%"
      minWidth="100px"
      maxWidth="50%"
      splitter="right"
    >
      <div>Left Pane</div>
    </Pane>
    <Pane id="right-pane">
      <div>Auto Pane</div>
    </Pane>
  </PaneRow>
</PaneSystem>
```
