resource "aws_elastictranscoder_pipeline" "video_encoder" {
  // TODO: determine if this needs the source video kms or destination
  aws_kms_key_arn = "${aws_kms_key.s3.arn}"

  content_config = {
    bucket        = "${aws_s3_bucket.transcoded_videos.id}"
    storage_class = "Standard"
  }

  input_bucket = "${aws_s3_bucket.source_videos.id}"

  notifications = {
    completed   = "${aws_sns_topic.video_encoder_completed.arn}"
    error       = "${aws_sns_topic.video_encoder_error.arn}"
    progressing = "${aws_sns_topic.video_encoder_progressing.arn}"
    warning     = "${aws_sns_topic.video_encoder_warning.arn}"
  }

  role = "${aws_iam_role.elastic_transcoder.arn}"

  thumbnail_config = {
    bucket        = "${aws_s3_bucket.video_thumbnails.id}"
    storage_class = "Standard"
  }
}

resource "aws_elastictranscoder_preset" "widescreenFHD" {
  audio {
    audio_packing_mode = "SingleTrack"
    bit_rate           = "256"
    channels           = "2"
    codec              = "AAC"
    sample_rate        = "44100"
  }

  audio_codec_options {
    profile = "AAC-LC"
  }

  container   = "ts"
  description = "Widescreen 1080p (FHD) preset"
  name        = "widescreenFHD"

  thumbnails {
    format         = "png"
    interval       = "3"
    max_height     = "108"
    max_width      = "192"
    padding_policy = "NoPad"
    sizing_policy  = "Fit"
  }

  video {
    bit_rate             = "20000"
    codec                = "H.264"
    display_aspect_ratio = "auto"
    fixed_gop            = "true"
    frame_rate           = "auto"
    keyframes_max_dist   = "90"
    max_height           = "1080"
    max_width            = "1920"
    padding_policy       = "NoPad"
    sizing_policy        = "Fit"
  }

  video_codec_options = {
    ColorSpaceConversionMode = "None"
    InterlaceMode            = "Progressive"
    Level                    = "4.1"
    MaxReferenceFrames       = 3
    Profile                  = "high"
  }
}
