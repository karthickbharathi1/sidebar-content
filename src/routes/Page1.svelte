<script>
  import { data1 } from './data1.js';
  import Sidebar from './Sidebar.svelte';
  import Content from './Content.svelte';

  let selectedCard; // Initialize selectedCard as undefined initially

  function setSelectedCard(card) {
    selectedCard = card;
  }
  
</script>

<div class="flex bg-gray-100 min-h-screen">
  <Sidebar class="w-1/4 p-4" data1={data1} setSelectedCard={setSelectedCard} />

  {#if selectedCard}
    <Content class="w-3/4 p-4" selectedCard={selectedCard} setSelectedCard={setSelectedCard} />
  {/if}
</div>


