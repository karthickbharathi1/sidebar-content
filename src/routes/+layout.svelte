<script>
  import './styles.css';
  import { Router, Route } from 'svelte-routing';
  import Page1 from './Page1.svelte';
  import Content from './Content.svelte';

  let selectedCard = null;
</script>
<Router>
 <slot />
  <Route path="/">
    <Page1 selectedCard={selectedCard} setSelectedCard={val => (selectedCard = val)} />
  </Route>
  <Route path="/content">
    <Content selectedCard={selectedCard} setSelectedCard={val => (selectedCard = val)} />
  </Route>
</Router>
