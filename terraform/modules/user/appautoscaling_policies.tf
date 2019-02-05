resource "aws_appautoscaling_policy" "aurthentications_read" {
  name               = "DynamoDBReadCapacityUtilization:${aws_appautoscaling_target.authentications_read.resource_id}"
  policy_type        = "TargetTrackingScaling"
  resource_id        = "${aws_appautoscaling_target.authentications_read.resource_id}"
  scalable_dimension = "${aws_appautoscaling_target.authentications_read.scalable_dimension}"
  service_namespace  = "${aws_appautoscaling_target.authentications_read.service_namespace}"

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "DynamoDBReadCapacityUtilization"
    }

    target_value = "${var.target_as}"
  }
}

resource "aws_appautoscaling_policy" "aurthentications_write" {
  name               = "DynamoDBReadCapacityUtilization:${aws_appautoscaling_target.authentications_write.resource_id}"
  policy_type        = "TargetTrackingScaling"
  resource_id        = "${aws_appautoscaling_target.authentications_write.resource_id}"
  scalable_dimension = "${aws_appautoscaling_target.authentications_write.scalable_dimension}"
  service_namespace  = "${aws_appautoscaling_target.authentications_write.service_namespace}"

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "DynamoDBWriteCapacityUtilization"
    }

    target_value = "${var.target_as}"
  }
}

resource "aws_appautoscaling_policy" "authentications_user_id_index_read" {
  name               = "DynamoDBReadCapacityUtilization:${aws_appautoscaling_target.authentications_user_id_index_read.resource_id}"
  policy_type        = "TargetTrackingScaling"
  resource_id        = "${aws_appautoscaling_target.authentications_user_id_index_read.resource_id}"
  scalable_dimension = "${aws_appautoscaling_target.authentications_user_id_index_read.scalable_dimension}"
  service_namespace  = "${aws_appautoscaling_target.authentications_user_id_index_read.service_namespace}"

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "DynamoDBReadCapacityUtilization"
    }

    target_value = "${var.target_as}"
  }
}

resource "aws_appautoscaling_policy" "aurthentications_user_id_index_write" {
  name               = "DynamoDBReadCapacityUtilization:${aws_appautoscaling_target.authentications_user_id_index_write.resource_id}"
  policy_type        = "TargetTrackingScaling"
  resource_id        = "${aws_appautoscaling_target.authentications_user_id_index_write.resource_id}"
  scalable_dimension = "${aws_appautoscaling_target.authentications_user_id_index_write.scalable_dimension}"
  service_namespace  = "${aws_appautoscaling_target.authentications_user_id_index_write.service_namespace}"

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "DynamoDBWriteCapacityUtilization"
    }

    target_value = "${var.target_as}"
  }
}

resource "aws_appautoscaling_policy" "authentications_email_authentications_id_unique_index_read" {
  name               = "DynamoDBReadCapacityUtilization:${aws_appautoscaling_target.authentications_email_authentication_id_unique_index_read.resource_id}"
  policy_type        = "TargetTrackingScaling"
  resource_id        = "${aws_appautoscaling_target.authentications_email_authentication_id_unique_index_read.resource_id}"
  scalable_dimension = "${aws_appautoscaling_target.authentications_email_authentication_id_unique_index_read.scalable_dimension}"
  service_namespace  = "${aws_appautoscaling_target.authentications_email_authentication_id_unique_index_read.service_namespace}"

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "DynamoDBReadCapacityUtilization"
    }

    target_value = "${var.target_as}"
  }
}

resource "aws_appautoscaling_policy" "authentications_email_authentication_id_unique_index_write" {
  name               = "DynamoDBReadCapacityUtilization:${aws_appautoscaling_target.authentications_email_authentication_id_unique_index_write.resource_id}"
  policy_type        = "TargetTrackingScaling"
  resource_id        = "${aws_appautoscaling_target.authentications_email_authentication_id_unique_index_write.resource_id}"
  scalable_dimension = "${aws_appautoscaling_target.authentications_email_authentication_id_unique_index_write.scalable_dimension}"
  service_namespace  = "${aws_appautoscaling_target.authentications_email_authentication_id_unique_index_write.service_namespace}"

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "DynamoDBWriteCapacityUtilization"
    }

    target_value = "${var.target_as}"
  }
}

resource "aws_appautoscaling_policy" "email_authentications_read" {
  name               = "DynamoDBReadCapacityUtilization:${aws_appautoscaling_target.email_authentications_read.resource_id}"
  policy_type        = "TargetTrackingScaling"
  resource_id        = "${aws_appautoscaling_target.email_authentications_read.resource_id}"
  scalable_dimension = "${aws_appautoscaling_target.email_authentications_read.scalable_dimension}"
  service_namespace  = "${aws_appautoscaling_target.email_authentications_read.service_namespace}"

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "DynamoDBReadCapacityUtilization"
    }

    target_value = "${var.target_as}"
  }
}

resource "aws_appautoscaling_policy" "email_authentications_write" {
  name               = "DynamoDBReadCapacityUtilization:${aws_appautoscaling_target.email_authentications_write.resource_id}"
  policy_type        = "TargetTrackingScaling"
  resource_id        = "${aws_appautoscaling_target.email_authentications_write.resource_id}"
  scalable_dimension = "${aws_appautoscaling_target.email_authentications_write.scalable_dimension}"
  service_namespace  = "${aws_appautoscaling_target.email_authentications_write.service_namespace}"

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "DynamoDBWriteCapacityUtilization"
    }

    target_value = "${var.target_as}"
  }
}

resource "aws_appautoscaling_policy" "email_authentications_email_unique_index_read" {
  name               = "DynamoDBReadCapacityUtilization:${aws_appautoscaling_target.email_authentications_email_unique_index_read.resource_id}"
  policy_type        = "TargetTrackingScaling"
  resource_id        = "${aws_appautoscaling_target.email_authentications_email_unique_index_read.resource_id}"
  scalable_dimension = "${aws_appautoscaling_target.email_authentications_email_unique_index_read.scalable_dimension}"
  service_namespace  = "${aws_appautoscaling_target.email_authentications_email_unique_index_read.service_namespace}"

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "DynamoDBReadCapacityUtilization"
    }

    target_value = "${var.target_as}"
  }
}

resource "aws_appautoscaling_policy" "email_authentications_email_unique_index_write" {
  name               = "DynamoDBReadCapacityUtilization:${aws_appautoscaling_target.email_authentications_email_unique_index_write.resource_id}"
  policy_type        = "TargetTrackingScaling"
  resource_id        = "${aws_appautoscaling_target.email_authentications_email_unique_index_write.resource_id}"
  scalable_dimension = "${aws_appautoscaling_target.email_authentications_email_unique_index_write.scalable_dimension}"
  service_namespace  = "${aws_appautoscaling_target.email_authentications_email_unique_index_write.service_namespace}"

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "DynamoDBWriteCapacityUtilization"
    }

    target_value = "${var.target_as}"
  }
}

resource "aws_appautoscaling_policy" "email_authentications_user_id_unique_index_read" {
  name               = "DynamoDBReadCapacityUtilization:${aws_appautoscaling_target.email_authentications_user_id_unique_index_read.resource_id}"
  policy_type        = "TargetTrackingScaling"
  resource_id        = "${aws_appautoscaling_target.email_authentications_user_id_unique_index_read.resource_id}"
  scalable_dimension = "${aws_appautoscaling_target.email_authentications_user_id_unique_index_read.scalable_dimension}"
  service_namespace  = "${aws_appautoscaling_target.email_authentications_user_id_unique_index_read.service_namespace}"

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "DynamoDBReadCapacityUtilization"
    }

    target_value = "${var.target_as}"
  }
}

resource "aws_appautoscaling_policy" "email_authentications_user_id_unique_index_write" {
  name               = "DynamoDBReadCapacityUtilization:${aws_appautoscaling_target.email_authentications_user_id_unique_index_write.resource_id}"
  policy_type        = "TargetTrackingScaling"
  resource_id        = "${aws_appautoscaling_target.email_authentications_user_id_unique_index_write.resource_id}"
  scalable_dimension = "${aws_appautoscaling_target.email_authentications_user_id_unique_index_write.scalable_dimension}"
  service_namespace  = "${aws_appautoscaling_target.email_authentications_user_id_unique_index_write.service_namespace}"

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "DynamoDBWriteCapacityUtilization"
    }

    target_value = "${var.target_as}"
  }
}

resource "aws_appautoscaling_policy" "users_read" {
  name               = "DynamoDBReadCapacityUtilization:${aws_appautoscaling_target.users_read.resource_id}"
  policy_type        = "TargetTrackingScaling"
  resource_id        = "${aws_appautoscaling_target.users_read.resource_id}"
  scalable_dimension = "${aws_appautoscaling_target.users_read.scalable_dimension}"
  service_namespace  = "${aws_appautoscaling_target.users_read.service_namespace}"

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "DynamoDBReadCapacityUtilization"
    }

    target_value = "${var.target_as}"
  }
}

resource "aws_appautoscaling_policy" "users_write" {
  name               = "DynamoDBReadCapacityUtilization:${aws_appautoscaling_target.users_write.resource_id}"
  policy_type        = "TargetTrackingScaling"
  resource_id        = "${aws_appautoscaling_target.users_write.resource_id}"
  scalable_dimension = "${aws_appautoscaling_target.users_write.scalable_dimension}"
  service_namespace  = "${aws_appautoscaling_target.users_write.service_namespace}"

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "DynamoDBWriteCapacityUtilization"
    }

    target_value = "${var.target_as}"
  }
}

resource "aws_appautoscaling_policy" "users_email_unique_index_read" {
  name               = "DynamoDBReadCapacityUtilization:${aws_appautoscaling_target.users_email_unique_index_read.resource_id}"
  policy_type        = "TargetTrackingScaling"
  resource_id        = "${aws_appautoscaling_target.users_email_unique_index_read.resource_id}"
  scalable_dimension = "${aws_appautoscaling_target.users_email_unique_index_read.scalable_dimension}"
  service_namespace  = "${aws_appautoscaling_target.users_email_unique_index_read.service_namespace}"

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "DynamoDBReadCapacityUtilization"
    }

    target_value = "${var.target_as}"
  }
}

resource "aws_appautoscaling_policy" "users_email_unique_index_write" {
  name               = "DynamoDBReadCapacityUtilization:${aws_appautoscaling_target.users_email_unique_index_write.resource_id}"
  policy_type        = "TargetTrackingScaling"
  resource_id        = "${aws_appautoscaling_target.users_email_unique_index_write.resource_id}"
  scalable_dimension = "${aws_appautoscaling_target.users_email_unique_index_write.scalable_dimension}"
  service_namespace  = "${aws_appautoscaling_target.users_email_unique_index_write.service_namespace}"

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "DynamoDBWriteCapacityUtilization"
    }

    target_value = "${var.target_as}"
  }
}

resource "aws_appautoscaling_policy" "users_user_name_unique_index_read" {
  name               = "DynamoDBReadCapacityUtilization:${aws_appautoscaling_target.users_user_name_unique_index_read.resource_id}"
  policy_type        = "TargetTrackingScaling"
  resource_id        = "${aws_appautoscaling_target.users_user_name_unique_index_read.resource_id}"
  scalable_dimension = "${aws_appautoscaling_target.users_user_name_unique_index_read.scalable_dimension}"
  service_namespace  = "${aws_appautoscaling_target.users_user_name_unique_index_read.service_namespace}"

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "DynamoDBReadCapacityUtilization"
    }

    target_value = "${var.target_as}"
  }
}

resource "aws_appautoscaling_policy" "users_user_name_unique_index_write" {
  name               = "DynamoDBReadCapacityUtilization:${aws_appautoscaling_target.users_user_name_unique_index_write.resource_id}"
  policy_type        = "TargetTrackingScaling"
  resource_id        = "${aws_appautoscaling_target.users_user_name_unique_index_write.resource_id}"
  scalable_dimension = "${aws_appautoscaling_target.users_user_name_unique_index_write.scalable_dimension}"
  service_namespace  = "${aws_appautoscaling_target.users_user_name_unique_index_write.service_namespace}"

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "DynamoDBWriteCapacityUtilization"
    }

    target_value = "${var.target_as}"
  }
}
