<script>
  export let data1;
  export let setSelectedCard;

  let searchQuery = '';

  // Filter data1 based on the search query
  $: filteredData1 = data1.filter(card =>
    card.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle card selection and set the selected card in the parent component
  const handleCardClick = card => {
    setSelectedCard(card);
  };
</script>

<div class="w-1/4 bg-gray-200 p-4 h-full">
  <input
    type="text"
    placeholder="Search for a card..."
    bind:value={searchQuery}
    class="w-full p-2 mb-4 rounded"
  />

  {#each filteredData1 as card (card.id)}
    <div
      class="bg-white p-4 mb-2 cursor-pointer hover:bg-gray-100"
      on:click={() => handleCardClick(card)}
    >
      <h2 class="font-semibold">{card.name}</h2>
      <p class="text-sm">{card.description}</p>
    </div>
  {/each}
</div>