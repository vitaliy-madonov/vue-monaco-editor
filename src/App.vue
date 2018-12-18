<template>
  <div>
    <!-- Load from webpack (note the srcPath="dist" prop) -->
    <Monaco
        height="600"
        language="typescript"
        srcPath="dist"
        :code="code"
        :options="options"
        :highlighted="highlightLines"
        :changeThrottle="500"
        theme="vs-dark"
        @mounted="onMounted"
        @codeChange="onCodeChange"
        >
    </Monaco>
  </div>
</template>

<script>
const Monaco = require('./Monaco.vue').default;

module.exports = {
  components: {
    Monaco
  },
  data() {
    return {
      code: '',
      highlightLines: [
        {
          number: 0,
          class: 'primary-highlighted-line'
        },
        {
          number: 0,
          class: 'secondary-highlighted-line'
        }
      ]
    };
  },
  methods: {
    onMounted(editor) {
      console.log('after mount!', editor, editor.getValue(), editor.getModel());
      this.editor = editor;
    },
    onCodeChange(editor) {
      console.log('code changed!', 'code:' + this.editor.getValue());
    },
  },
  created() {
    this.options = {
      selectOnLineNumbers: false
    };
  }
};
</script>

<style media="screen">
  .secondary-highlighted-line {
    background: green;
  }
  .primary-highlighted-line {
    background: blue;
  }
</style>
