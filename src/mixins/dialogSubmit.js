
export default {
  data () {
    return {}
  },
  methods: {
    getConfirmBtn () {
      return (
        <t-button theme="primary" type="submit" onClick={ () => this.onSubmitEvent() }>提交</t-button>
      )
    },
    onSubmitEvent () {
      this.$refs.formRef.submit({ showErrorMessage: true })
    }
  }
}
