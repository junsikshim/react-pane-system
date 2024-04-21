# react-pane-system

A declarative, flexible pane layout system for React projects.
Allows pixel and percent values to sizes(including min and max).

[View Storybook](https://junsikshim.github.io/react-pane-system)

---

## Usage

```jsx
<PaneSystem width="100vw" height="100vh">
  <PaneRow>
    {/* A pane with a splitter on the right side */}
    <Pane
      id="left-pane"
      width="30%"
      minWidth="100px"
      maxWidth="50%"
      splitter="right"
    >
      <div>Left Pane</div>
    </Pane>

    {/* This pane resizes automatically */}
    <Pane id="right-pane">
      <div>Right Pane</div>
    </Pane>
  </PaneRow>
</PaneSystem>
```

## Documentation

### PaneSystem

| Prop        | Type    | Description                                                                                             |
| ----------- | ------- | ------------------------------------------------------------------------------------------------------- |
| width       | string? | Width of the pane system. Can be any CSS string. (Default: `100%`)                                      |
| height      | string? | Height of the pane system. Can be any CSS string. (Default: `100%`)                                     |
| bgColor     | string? | Base background color for all the `Pane`s. Can be any CSS color string. (Default: `#4b5563`)            |
| borderWidth | number? | Base border width for all the `PaneRow`s and `Pane`s. (Default: `1`)                                    |
| borderColor | string? | Base border color for all the `PaneRow`s and `Pane`s. Can be any CSS color string. (Default: `#909090`) |

### PaneRow

| Prop           | Type    | Description                                                                                             |
| -------------- | ------- | ------------------------------------------------------------------------------------------------------- |
| height         | string? | Height of the row. Can be either `px` or `%`. Only one row can have an `auto` height. (Default: `auto`) |
| minHeight      | string? | Minimum height of the row. Can be either `px` or `%`. (Default: `0`)                                    |
| maxHeight      | string? | Maximum height of the row. Can be either `px` or `%`. (Default: `100%`)                                 |
| splitter       | string? | Position of the splitter. Can be either `top` or `bottom`.                                              |
| splitterHeight | number? | Height of the splitter. (Default: `4`)                                                                  |
| splitterColor  | string? | Color of the splitter. Can be any CSS color string. (Default: `rgba(0, 0, 0, 0.2)`)                     |
| bgColor        | string? | Overrides the base background color for all the enclosed `Pane`s. Can be any CSS color string.          |
| borderWidth    | number? | Overrides the base border width for all the enclosed `Pane`s.                                           |
| borderColor    | string? | Overrides the base border color for all the enclosed `Pane`s. Can be any CSS color string.              |

### Pane

| Prop          | Type    | Description                                                                                             |
| ------------- | ------- | ------------------------------------------------------------------------------------------------------- |
| id            | string  | ID of the pane.                                                                                         |
| width         | string? | Width of the pane. Can be either `px` or `%`. Only one pane can have an `auto` width. (Default: `auto`) |
| minWidth      | string? | Minimum width of the pane. Can be either `px` or `%`. (Default: `0`)                                    |
| maxWidth      | string? | Maximum width of the pane. Can be either `px` or `%`. (Default: `100%`)                                 |
| splitter      | string? | Position of the splitter. Can be either `left` or `right`.                                              |
| splitterWidth | number? | Width of the splitter. (Default: `4`)                                                                   |
| splitterColor | string? | Color of the splitter. Can be any CSS color string. (Default: `rgba(0, 0, 0, 0.2)`)                     |
| bgColor       | string? | Overrides the base background color for this pane. Can be any CSS color string.                         |
| borderWidth   | number? | Overrides the base border width for this pane.                                                          |
| borderColor   | string? | Overrides the base border color for this pane. Can be any CSS color string.                             |
